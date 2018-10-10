import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../../services/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, switchMap} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {NgForm} from '@angular/forms';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {

  public wishes = null;
  public users = null;

  constructor(private db: AngularFireDatabase,private authService: AuthService, private fs: AngularFirestore) { }

  ngOnInit() {

    this.users = this.fs.collection("users").snapshotChanges().pipe(map(v=>{
      const userChanges = [];
      for (let i = 0; i < v.length; i++) {
        const vElement = v[i];
        userChanges.push(vElement.payload.doc.data());
      }
      return userChanges;
    }));

    this.wishes = this.fs.collection("drink-wishes").snapshotChanges().pipe(switchMap(v => {
      const creator = [];
      for (let i = 0; i < v.length; i++) {
        const vElement: any = v[i];
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
        const wishData: any = joinedData.wishes[i].payload.doc.data();
        wishes.push({
          name: wishData.name,
          creator: joinedData.data[i].data(),
          ref: joinedData.wishes[i].payload.doc.ref
        });
      }
      return wishes;
    }));
  }


  addNotification(uid,payload) {
    this.db.object('/messages/' + uid + '/'+this.fs.createId()).set({
      body: payload.body,
      title: payload.title,
      img: payload.img,
      click_action: "/prices"
    }).then(v => {
      //console.log('Success: ', v);
    }, console.error);
  }

  deleteWish(wish) {
    this.fs.doc(wish.ref).delete();
  }

  addNotificationWithForm(addForm: NgForm) {
    //console.log(addForm);
    if(addForm.valid && addForm.value.users.length > 0){
      for (let i = 0; i < addForm.value.users.length; i++) {
        const user = addForm.value.users[i];
        this.addNotification(user,{body: addForm.value.body, title: addForm.value.title, img: addForm.value.img});
      }
    }
  }
}
