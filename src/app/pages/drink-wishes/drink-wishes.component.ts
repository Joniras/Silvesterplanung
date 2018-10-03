import {Component, OnInit} from '@angular/core';
import {AngularFirestore, AngularFirestoreCollection, DocumentReference} from "@angular/fire/firestore";
import {combineLatest, Observable, of} from "rxjs";
import {AuthService} from "../../services/auth.service";
import {AngularFireAuth} from "@angular/fire/auth";
import {map, shareReplay, take, tap} from "rxjs/operators";
import {firestore} from "firebase";

@Component({
  selector: 'app-drink-wishes',
  templateUrl: './drink-wishes.component.html',
  styleUrls: ['./drink-wishes.component.scss']
})
export class DrinkWishesComponent implements OnInit {
  private coll_wishes: AngularFirestoreCollection<any>;
  public wishes: Observable<any[]>;

  constructor(private db: AngularFirestore, private authenticator: AuthService, private auth: AngularFireAuth) {
    this.coll_wishes = db.collection('drink-wishes');
    // this.getWishes(this.authenticator.getUserRef());
    this.wishes = combineLatest(this.coll_wishes.snapshotChanges(), this.authenticator.getUser()).pipe(map((v) => {
      if (v[0]) {
        // console.log("in here", v);
        return v[0].map(wish => {
          const data = wish.payload.doc.data();
          // console.log("Data: ", data);
          data.creator = this.db.doc(data.creator).valueChanges();
          const path = wish.payload.doc.ref.path;
          data.votes = this.db.collection(path + "/votes").valueChanges();
          data.voted = v[1] ? this.db.collection(path + "/votes", ref => ref.where("voter", "==", this.authenticator.getUserRef()))
            .snapshotChanges().pipe(map(vote => {
            // console.log("V[0]: ", vote);
            return vote[0] ? vote[0].payload.doc.ref : null;
          }), shareReplay(1)) : of(null);
          return {data: data, path: path};
        });
      }
    }));
  }

  ngOnInit() {

  }

  addWish(name: string) {
    // console.log(this.authenticator.getUserId());
    this.coll_wishes.add({name: name, creator: this.authenticator.getUserRef()});
  }

  like(wish) {
    // kein Wert emitted
    wish.data.voted.pipe(take(1)).subscribe(v => {
      if (v != null) {
        this.db.doc(v).delete();
      } else {
        this.db.collection(wish.path + "/votes").add({voter: this.authenticator.getUserRef()});
      }
    });
  }
}
