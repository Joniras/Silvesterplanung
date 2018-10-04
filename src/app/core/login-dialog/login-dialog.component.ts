import {Component, OnInit, ViewChild} from '@angular/core';
import {auth} from 'firebase';
import {animate, state, style, transition, trigger} from '@angular/animations';
import {MatDialogRef, MatTab, MatTabGroup} from '@angular/material';
import {NotificationType} from 'angular2-notifications';
import {AuthService} from '../../services/auth.service';
import {NotificationService} from '../../services/notification.service';

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
          opacity: '0',
          height: '0',
          visibility: 'hidden'
        }
      )),
      state('true', style({
        opacity: '1',
        height: 'inherit'
      })),
      transition('false<=>true', animate('500ms'))
    ])
  ]
})
export class LoginDialogComponent implements OnInit {
  public pendingState = 'notPending';
  public pendingAddState = 'notPending';

  public pendingUser: auth.UserCredential = null;

  @ViewChild('tabGroup')
  public tabGroup: MatTabGroup = null;
  @ViewChild('tab1')
  public tab1: MatTab = null;
  @ViewChild('tab2')
  public tab2: MatTab = null;
  wantsRegister = false;
  public registeringWithEmail = false;

  constructor(public dialogRef: MatDialogRef<LoginDialogComponent>,
              private authService: AuthService,
              public notification: NotificationService) {

  }

  ngOnInit() {
  }

  doLogin(formular) {
    if (formular.controls.password.status === 'VALID' && formular.controls.email.status === 'VALID'
      && ((this.wantsRegister && formular.controls.password_repeat.status === 'VALID') || !this.wantsRegister)) {
      this.pendingState = 'pending';
      this.registeringWithEmail = true;
      if (this.wantsRegister) {
        this.authService.registerWithEmail(formular.value.email, formular.value.password).then(() => {
          this.pendingState = 'notPending';
          this.isNewUser();
        }, e => {
          this.loginFailed(e);
        });
      } else {
        this.authService.loginWithEmail(formular.value.email, formular.value.password).then(v => {
          this.pendingState = 'notPending';
          if (v.isnew) {
            this.isNewUser();
          } else {
            this.closeDialog();
          }
        },  e => {
          this.loginFailed(e);
        });
      }
    } else {
      this.notification.show('Überprüfe deine Eingaben', NotificationType.Info);
    }
  }

  isNewUser() {
    this.dialogRef.disableClose = true;
    this.tab2.disabled = false;
    this.tabGroup.selectedIndex = 1;
    this.tab1.disabled = true;
  }

  googleLogin() {
    this.pendingState = 'pending';
    this.authService.loginWithGoogle().then(v => {
      this.pendingState = 'notPending';
      if (v.isnew) {
        this.isNewUser();
      } else {
        this.closeDialog();
      }
    });
  }

  private loginFailed(e) {
    this.pendingState = 'notPending';
    this.notification.show('Login nicht erfolgreich', NotificationType.Error, e);
  }

  facebookLogin() {
    this.pendingState = 'pending';
    this.authService.loginWithFacebook().then(v => {
      this.pendingState = 'notPending';
      if (v.isnew) {
        this.isNewUser();
      } else {
        this.closeDialog();
      }
    });
  }

  closeDialog() {
    this.registeringWithEmail = false;
    this.dialogRef.close();
  }

  forgotPass() {
    console.log('Forgot Pass ');
  }

  saveAdditionalInfo(addForm: HTMLFormElement) {
    if (addForm.status === 'VALID') {
      console.log(addForm);
      const addInfo: any = {displayName: addForm.value.visibleName};
      if(this.registeringWithEmail){
        addInfo.photoUrl = addForm.value.url;
      }
      this.authService.saveAddInfo(addInfo).then(() => {
        this.closeDialog();
      }, e => {
        console.log('Didnt work: ', e);
      }).catch(e => {
        console.log("Error: ",e);
      });
    }
  }
}
