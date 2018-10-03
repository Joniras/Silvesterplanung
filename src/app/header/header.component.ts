import {Component, OnInit} from '@angular/core';
import {AuthService} from "../services/auth.service";
import {MatDialog} from "@angular/material";
import {LoginDialogComponent} from "../pages/login/login-dialog/login-dialog.component";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  public user = null;
  public checkingIfAlreadyLoggedIn = true;

  constructor( private authenticator: AuthService, private dialog: MatDialog) {
    this.authenticator.getUser().subscribe(v => {
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
