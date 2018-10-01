import {Component} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {Observable} from 'rxjs/internal/Observable';
import {AuthService} from './services/auth.service';
import {MatDialog} from '@angular/material';
import {LoginDialogComponent} from './pages/login/login-dialog/login-dialog.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  items: Observable<any[]>;

  constructor(db: AngularFirestore, private auth: AuthService, private dialog: MatDialog) {
    this.items = db.collection('items').valueChanges();
  }

  login() {
    this.dialog.open(LoginDialogComponent, {
      disableClose: true
    });
  }

  logout() {
    this.auth.logout();
  }


}
