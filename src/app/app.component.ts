import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './services/auth.service';
import {LoginDialogComponent} from './core/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material';
import {NotificationService} from './services/notification.service';
import {AngularFireDatabase} from '@angular/fire/database';
import {SwUpdate} from '@angular/service-worker';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav')
  public sidenav = null;

  public user = null;

  constructor(private authService: AuthService, private dialog: MatDialog, private notification: NotificationService, private db: AngularFireDatabase, updates: SwUpdate) {
    this.user = authService.getUserObservable();
    updates.available.subscribe(event => {
      updates.activateUpdate().then(() => document.location.reload());
    });
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
}


