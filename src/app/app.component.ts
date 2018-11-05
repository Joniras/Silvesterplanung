import {AfterViewChecked, Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './services/auth.service';
import {LoginDialogComponent} from './core/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material';
import {NotificationService} from './services/notification.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {SwUpdate} from '@angular/service-worker';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faCheckCircle, faCircle, faQuestionCircle, faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import {VersionService} from './services/version.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, AfterViewChecked {
  @ViewChild('sidenav')
  public sidenav = null;
  public icons = [faArrowDown, faCheckCircle, faTimesCircle, faQuestionCircle, faCircle];
  public user = null;
  public showUpdate = false;
  public update = null;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private notification: NotificationService,
    private db: AngularFireDatabase,
    private updates: SwUpdate,
    private versionService: VersionService) {
    this.user = authService.getUserObservable();
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => {
        this.showUpdate = true;
      });
    });
    this.update = this.versionService.$hasNewVersion();
  }

  login() {
    this.sidenav.toggle();
    this.dialog.open(LoginDialogComponent, {
      disableClose: false
    });
  }

  ngOnInit(): void {
  }

  logout() {
    this.authService.logout();
  }

  setZusageStatus(number: number) {
    this.authService.setZusageStatus(number);
  }

  ngAfterViewChecked(): void {
    if (this.showUpdate) {
      this.showUpdate = false;
      setTimeout(()=>{
        this.versionService.hasUpdate();
      },200);
    }
  }

  reloadPage() {
    document.location.reload();
  }
}


