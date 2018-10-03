import {Injectable} from '@angular/core';
import {auth, firestore, User} from 'firebase';
import {BehaviorSubject} from "rxjs";
import {AngularFireAuth} from "@angular/fire/auth";
import {take} from "rxjs/operators";
import {NotificationService} from "./notification.service";
import {NotificationType} from "angular2-notifications";
import {AngularFireDatabase} from "@angular/fire/database";
import {AngularFirestore} from "@angular/fire/firestore";
import DocumentReference = firestore.DocumentReference;
import * as firebase from "firebase";

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userSubject = new BehaviorSubject<User>(null);
  private userRef: DocumentReference = null;

  constructor(private afAuth: AngularFireAuth, private notification: NotificationService, private db: AngularFirestore) {
    afAuth.authState.pipe(take(1)).subscribe(user => {
      this.db.collection("/users", ref => ref.where("uid", "==", user.uid)).snapshotChanges().pipe(take(1)).subscribe(v => {
        this.userRef = v[0].payload.doc.ref;
        this.userSubject.next(user);
      });
    });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.userSubject.next(null);
    }, e => {
      this.notification.show("Das hat nicht geklappt", NotificationType.Error, e);
    });
  }

  login(user: auth.UserCredential) {
    this.db.collection("/users").add({uid: user.user.uid, photoUrl: user.user.photoURL, displayName: user.user.displayName, email: user.user.email}).then(ref => {
      this.userRef = ref;
    });
    this.userSubject.next(user.user);
  }

  public getUser() {
    return this.userSubject;
  }

  public getUserRef() {
    return this.userRef;
  }

}
