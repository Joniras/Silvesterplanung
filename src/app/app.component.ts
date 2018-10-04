import {Component, OnInit, ViewChild} from '@angular/core';
import {AuthService} from './services/auth.service';
import {LoginDialogComponent} from './core/login-dialog/login-dialog.component';
import {MatDialog} from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  @ViewChild('sidenav')
  public sidenav = null;

  constructor(private authService: AuthService, private dialog: MatDialog) {

  }

  login(){
    this.sidenav.toggle();
    this.dialog.open(LoginDialogComponent, {
      disableClose: false
    });
  }

  ngOnInit(): void {
  }


}
