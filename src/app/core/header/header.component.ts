import {AfterViewInit, Component, EventEmitter, OnInit, Output} from '@angular/core';
import {MatDialog} from '@angular/material';
import {LoginDialogComponent} from '../login-dialog/login-dialog.component';
import {AuthService} from '../../services/auth.service';
import {UserProfile} from '../../other/interfaces';
import {skip} from 'rxjs/operators';
import {faArrowDown} from '@fortawesome/free-solid-svg-icons';
import {faCheckCircle, faCircle, faQuestionCircle, faTimesCircle} from '@fortawesome/free-regular-svg-icons';
import {VersionService} from '../../services/version.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, AfterViewInit {
  @Output()
  public toggleNav = new EventEmitter();
  public icons = [faArrowDown, faCheckCircle, faTimesCircle, faQuestionCircle, faCircle];

  public user: UserProfile = null;
  public checkingIfAlreadyLoggedIn = true;
  public update = null;

  constructor(private authenticator: AuthService, private dialog: MatDialog, private version: VersionService) {
    this.update = version.$hasNewVersion();
    this.authenticator.getUserObservable().pipe(skip(1)).subscribe(v => {
      this.user = v;
      this.checkingIfAlreadyLoggedIn = false;
      // console.log("new user: ",v);
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

  reloadPage(){
    document.location.reload();
  }

  openNav() {
    this.toggleNav.emit();
  }

  ngAfterViewInit(): void {
  }

  setZusageStatus(number: number) {
    this.authenticator.setZusageStatus(number);
  }
}
