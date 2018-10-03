import {Component, OnInit, ViewChild} from '@angular/core';
import {auth} from 'firebase';
import {AngularFireAuth} from '@angular/fire/auth';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialogRef, MatTab, MatTabGroup} from '@angular/material';
import {AuthService} from '../../../services/auth.service';
import {NotificationService} from '../../../services/notification.service';
import {NotificationType} from 'angular2-notifications';
import Persistence = firebase.auth.Auth.Persistence;
import * as firebase from '../../../../../node_modules/firebase';

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
      transition('notPending<=>pending', animate('300ms'))
    ]), trigger('loginPendingIcon', [
      state('notPending', style({
        opacity: 0
      })),
      state('pending', style({
        opacity: 1
      })),
      transition('notPending<=>pending', animate('300ms')),
    ]),
    trigger('repeatPasswordShown', [
      state('false', style({
          opacity: "0",
          height: "0",
          visibility: "hidden"
        }
      )),
      state("true", style({
        opacity: "1",
        height: "inherit"
      })),
      transition('false<=>true', animate('500ms'))
    ])
  ]
})
export class LoginDialogComponent implements OnInit {
  public pendingState = 'notPending';
  public pendingAddState = 'notPending';

  public pendingUser: auth.UserCredential = null;

  @ViewChild("tabGroup")
  public tabGroup: MatTabGroup = null;
  @ViewChild("tab1")
  public tab1: MatTab = null;
  @ViewChild("tab2")
  public tab2: MatTab = null;
  wantsRegister = false;

  constructor(public afAuth: AngularFireAuth,
              public dialogRef: MatDialogRef<LoginDialogComponent>,
              private authService: AuthService,
              public notification: NotificationService) {

    this.afAuth.auth.setPersistence(Persistence.LOCAL);

  }

  ngOnInit() {
  }

  doLogin(formular) {
    console.log(formular);
    if (formular.controls.password.status === "VALID" && formular.controls.username.status === "VALID"
      && ((this.wantsRegister && formular.controls.password_repeat.status === "VALID") || !this.wantsRegister)) {
      this.pendingState = 'pending';
      if (this.wantsRegister) {
        this.afAuth.auth.createUserAndRetrieveDataWithEmailAndPassword(formular.value.username, formular.value.password)
          .then(returnValue => {
            console.log('Authenticated via Mail: ', returnValue);
            this.didLogin(returnValue);
          }, e => this.loginFailed(e));
      } else {
        this.afAuth.auth.signInAndRetrieveDataWithEmailAndPassword(formular.value.username, formular.value.password)
          .then(returnValue => {
            console.log('Authenticated via Mail: ', returnValue);
            this.didLogin(returnValue);
          }, e => this.loginFailed(e));
      }
    } else {
      this.notification.show("Überprüfe deine Eingaben", NotificationType.Info);
    }
  }

  isNewUser(user: auth.UserCredential) {
    this.tab2.disabled = false;
    this.tabGroup.selectedIndex = 1;
    this.tab1.disabled = true;
  }

  didLogin(user: auth.UserCredential) {
    this.pendingState = 'notPending';
    if (user.additionalUserInfo.isNewUser) {
      this.dialogRef.disableClose = true;
      this.pendingUser = user;
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

  forgotPass() {
    console.log("Forgot Pass ");
  }

  saveAdditionalInfo(addForm: HTMLFormElement) {
    if (addForm.status === "VALID") {
      this.pendingUser.user.updateProfile({
        displayName: addForm.value.visibleName,
        photoURL: undefined
      }).then(v => {
        console.log("Worked", v);
        this.authService.login(this.pendingUser);
        this.dialogRef.close();
      }, e => {
        console.log("Didddnt work: ", e);
      });
    }
  }
}
