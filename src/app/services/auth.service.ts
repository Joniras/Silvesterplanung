import {Injectable} from '@angular/core';
import {auth} from 'firebase';
import {BehaviorSubject} from 'rxjs';
import {AngularFireAuth} from '@angular/fire/auth';
import {take} from 'rxjs/operators';
import {NotificationService} from './notification.service';
import {NotificationType} from 'angular2-notifications';
import {AngularFirestore} from '@angular/fire/firestore';
import {UserProfile} from '../core/interfaces';
import Persistence = auth.Auth.Persistence;

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private loggedIn = new BehaviorSubject<UserProfile>(null);
  private pending: auth.UserCredential = null;

  constructor(private afAuth: AngularFireAuth, private notification: NotificationService, private db: AngularFirestore) {
    this.afAuth.auth.setPersistence(Persistence.LOCAL);


    // wenn man noch eingeloggt ist (cookies)
    this.checkIfValidUser();

  }


  public getUser() {
    return this.loggedIn.getValue();
  }

  public getUserObservable() {
    return this.loggedIn;
  }

  private checkIfValidUser() {
    if (this.pending) {
      this.checkUID(this.pending.user.uid);
    } else {
      this.afAuth.authState.pipe(take(1)).subscribe(user => {
        if (user) {
          this.checkUID(user.uid);
        }
      });
    }
  }

  private checkUID(uid) {
    this.getProfileInfo(uid).then(profile => {
      if (profile) {
        this.pending = null;
        console.log('Found User: ', profile);
        this.loggedIn.next(profile);
      }
    });
  }

  logout() {
    this.afAuth.auth.signOut().then(() => {
      this.loggedIn.next(null);
    }, e => {
      this.notification.show('Das hat nicht geklappt', NotificationType.Error, e);
    });
  }

  getProfileInfo(uid: string): Promise<UserProfile> {
    return new Promise<UserProfile>((resolve, reject) => {
      this.db.collection('/users', reference => reference.where('uid', '==', uid)).snapshotChanges().pipe(take(1)).subscribe(userProfiles => {
        if (userProfiles.length === 0) {
          resolve(null);
          this.logout();
        } else {
          const data = userProfiles[0].payload.doc.data();
          // @ts-ignore
          resolve({...data, ref: userProfiles[0].payload.doc.ref});
        }
      }, reject);
    });
  }


  registerWithEmail(email: string, password: string) {
    return new Promise((resolve, reject) => {
      this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(email, password)
        .then(user => {
          console.log('Authenticated via Mail: ', user);
          this.pending = user;
          resolve();
        }, reject);
    });
  }

  loginWithEmail(email: string, password: string) {
    return new Promise<{ isnew: boolean }>((resolve, reject) => {
      this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(email, password)
        .then(user => {
          this.getProfileInfo(user.user.uid).then(v => {
            if (v == null || !v.displayName) {
              this.pending = user;
              resolve({isnew: true});
            } else {
              this.checkIfValidUser();
              resolve({isnew: false});
            }
          }, reject);
        }, reject);
    });
  }

  loginWithFacebook() {
    return new Promise<{ isnew: boolean }>((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()).then(user => {
        console.log('Authenticated with Facebook: ', user);
        this.getProfileInfo(user.user.uid).then(v => {

          if (v == null || !v.displayName) {
            this.pending = user;
            resolve({isnew: true});
          } else {
            this.checkIfValidUser();
            resolve({isnew: false});
          }
        }, reject);
      }, reject).catch(reject);
    });
  }

  loginWithGoogle() {
    return new Promise<{ isnew: boolean }>((resolve, reject) => {
      this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(user => {
        console.log('Authenticated with Google: ', user);
        this.getProfileInfo(user.user.uid).then(v => {
          if (v == null || !v.displayName) {
            this.pending = user;
            resolve({isnew: true});
          } else {
            this.checkIfValidUser();
            resolve({isnew: false});
          }
        }, reject);
      }, reject).catch(reject);
    });
  }

  //TODO: testen, ob originaler Name gespeichert wird

  saveAddInfo(param: any) {
    return new Promise((resolve, reject) => {
      this.getProfileInfo(this.pending.user.uid).then(v => {
        if (v == null) {
          this.db.collection('/users').add({
            uid: this.pending.user.uid,
            originalDisplayName: this.pending.user.displayName,
            displayName: param.displayName,
            email: this.pending.user.email,
            photoUrl: param.photoUrl ? param.photoUrl : this.pending.user.photoURL
          }).then(() => {
            this.checkIfValidUser();
            resolve();
          }, reject);
        } else {
          this.db.doc(v.ref).update({
            displayName: param.displayName,
            photoUrl: param.photoUrl ? param.photoUrl : this.pending.user.photoURL
          }).then(() => {
            this.checkIfValidUser();
            resolve();
          }, reject);
        }
      });

    });
  }
}
