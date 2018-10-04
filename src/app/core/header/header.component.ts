import {Component, OnInit} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {AuthService} from '../../services/auth.service';
import {UserProfile} from '../../other/interfaces';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user: UserProfile = null;
  public checkingIfAlreadyLoggedIn = true;

  constructor(private authenticator: AuthService, private dialog: MatDialog) {
    this.authenticator.getUserObservable().subscribe(v => {
      this.user = v;
      this.checkingIfAlreadyLoggedIn = false;
    });
  }

  login() {
    this.dialog.open(LoginDialogComponent, {
      disableClose: false
    });
  }

  logout() {
    this.authenticator.logout();
  }

  ngOnInit(): void {
  }

}
