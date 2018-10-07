import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentChangeAction} from '@angular/fire/firestore';
import {combineLatest, forkJoin, of} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from 'angular2-notifications';
import {AngularFireDatabase} from '@angular/fire/database';
import {UserProfile} from '../../other/interfaces';
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-drink-wishes',
  templateUrl: './drink-wishes.component.html',
  styleUrls: ['./drink-wishes.component.scss'],
  animations: [
    trigger( "voted",[
      state("yes", style({
        color: "#da2002"
      })),
      state( "no",style({
        color: "white"
      })),
      transition("yes<=>no",animate( "200ms"))
    ]),
    trigger( "loading",[
      state("yes", style({
        opacity: 1
      })),
      state( "no", style({
        opacity: 0,
        height: 0,
        maxHeight: 0
      })),
      transition("yes=>no", animate( "500ms"))
    ]),
    trigger( "fadeIn",[
      state("no", style({
        opacity: 1
      })),
      state( "yes", style({
        opacity: 0,
      })),
      transition("no<=>yes", animate( "500ms"))
    ])
  ]
})
export class DrinkWishesComponent implements OnInit {
  private coll_wishes: AngularFirestoreCollection<any>;
  public user = null;
  public wishes = null;
  public loading = true;
  @ViewChild('tooltip-content')
  public tooltip_content = null;

  constructor(private db: AngularFirestore, private authenticator: AuthService, private notification: NotificationService, private angularfire: AngularFireDatabase) {
    // this.getWishes(this.authenticator.getUserRef());

    this.user = this.authenticator.getUserObservable();
  }

  trackByFn(index, item) {
    return item.path;
  }

  ngOnInit() {
    this.coll_wishes = this.db.collection('drink-wishes');
    this.wishes = this.coll_wishes.snapshotChanges().pipe(switchMap(v => {
      const creator = [];
      for (let i = 0; i < v.length; i++) {
        const vElement = v[i];
        creator.push(vElement.payload.doc.data().creator.get());
      }
      if (v.length > 0) {
        return forkJoin(creator).pipe(map(data => {
          return {wishes: v, data: data};
        }));
      } else {
        return of({wishes: v, data: []});
      }

    }), map(joinedData => {
      const wishes = [];
      for (let i = 0; i < joinedData.data.length; i++) {
        const wishData = joinedData.wishes[i].payload.doc.data();
        const voterObs = combineLatest(
          this.authenticator.getUserObservable(),
          this.db.collection(joinedData.wishes[i].payload.doc.ref.path + '/votes').snapshotChanges()
        ).pipe(map((data: [UserProfile, DocumentChangeAction<any>[]]) => {
          let names = 'Diesen Leuten hat das gefallen:\n';
          let vote = null;
          for (let j = 0; j < data[1].length; j++) {
            const dataElement = data[1][j].payload.doc.data();
            names += dataElement.voterName + '\n';
            if (data[0] && dataElement.voterRef.id === data[0].ref.id) {
              vote = data[1][j].payload.doc.ref;
            }
          }
          names = names.substr(0, names.length - 1);
          if (data[1].length == 1 && vote) {
            names = 'Das gefällt echt nur dir';
          } else if (data[1].length == 0) {
            names = 'Das gefiel bisher keinem';
          }
          return {vote: vote, voterNames: names, voteCount: data[1].length};
        }), shareReplay(1));
        wishes.push({
          name: wishData.name,
          creator: joinedData.data[i].data(),
          votes: voterObs,
          path: joinedData.wishes[i].payload.doc.ref.path
        });
      }
      return wishes;
    }), tap((v) => {
        this.loading = false;
      }
    ));

  }

  submit(form, name: string) {
    console.log(this.tooltip_content);
    if (form.status === 'VALID') {
      if (this.authenticator.getUser() && name.length != 0) {
        this.coll_wishes.add({name: name, creator: this.authenticator.getUser().ref});
      }
    }
  }

  like(wish) {
    // kein Wert emitted
    wish.votes.pipe(take(1)).subscribe(v => {
      if (v.vote != null) {
        this.db.doc(v.vote).delete();
      } else {
        if (this.authenticator.getUser()) {
          this.db.collection(wish.path + '/votes').add({
            voterName: this.authenticator.getUser().displayName,
            voterRef: this.authenticator.getUser().ref
          });
        } else {
          this.notification.show('Dafür musst du dich einloggen', NotificationType.Info);
        }
      }
    });
  }
}

interface Vote {

}
