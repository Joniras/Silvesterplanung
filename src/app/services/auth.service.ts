import { Injectable } from '@angular/core';
import {auth} from 'firebase';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private userToken = null;

  constructor( ) {

  }


  logout() {
    this.userToken = null;
  }

  login(user: auth.UserCredential) {
    this.userToken = user.user.getIdToken();
  }
}
