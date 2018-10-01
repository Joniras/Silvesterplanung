import {Component, OnInit} from '@angular/core';
import {auth} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialogRef} from '@angular/material';
import {AuthService} from '../../../services/auth.service';
import {NotificationService} from '../../../services/notification.service';
import {NotificationType} from 'angular2-notifications';

@Component({
  selector: 'app-login-dialog',
  templateUrl: './login-dialog.component.html',
  styleUrls: ['./login-dialog.component.scss'],
  animations: [
    trigger('loginText', [
      state('notPending', style({
        opacity: 1
      })),
      state('pending', style({
        opacity: 0
      })),
      transition('*=>*', animate('300ms'))
    ]), trigger('loginPendingIcon', [
      state('notPending', style({
        opacity: 0
      })),
      state('pending', style({
        opacity: 1
      })),
      transition('*=>*', animate('300ms')),
    ])
  ]
})
export class LoginDialogComponent implements OnInit {
  public pendingState = 'notPending';

  constructor(public afAuth: AngularFireAuth,
              public dialogRef: MatDialogRef<LoginDialogComponent>,
              private authService: AuthService,
              public notification: NotificationService) {

  }

  ngOnInit() {
  }

  doLogin(formular) {
    this.pendingState = 'pending';
    this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(formular.value.username, formular.value.password).then(returnValue => {
      console.log('Authenticated via Mail: ', returnValue);
      this.didLogin(returnValue);
    }, e => this.loginFailed(e));
  }

  isNewUser(user: auth.UserCredential) {
    console.log('Is new User');
  }

  didLogin(user: auth.UserCredential) {
    this.pendingState = 'notPending';
    if (user.additionalUserInfo.isNewUser) {
      this.isNewUser(user);
    } else {
      this.authService.login(user);
      this.dialogRef.close();
    }
  }

  googleLogin() {
    this.pendingState = 'pending';
    this.afAuth.auth.signInWithPopup(new auth.GoogleAuthProvider()).then(returnValue => {
      console.log('Authenticated via Google: ', returnValue);
      this.didLogin(returnValue);
    }, e => this.loginFailed(e));
  }

  private loginFailed(e) {
    this.pendingState = 'notPending';
    this.notification.show('Login nicht erfolgreich', NotificationType.Error, e);
  }

  facebookLogin() {
    this.pendingState = 'pending';
    this.afAuth.auth.signInWithPopup(new auth.FacebookAuthProvider()).then(returnValue => {
      console.log('Authenticated with Facebook: ', returnValue);
      this.didLogin(returnValue);
    }, e => this.loginFailed(e));
  }
}
