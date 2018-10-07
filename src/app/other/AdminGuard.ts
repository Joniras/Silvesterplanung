import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: AuthService) {};

  canActivate() {
    if (this.userService.getUser() && this.userService.getUser().admin) {
      return true;
    } else {
      // window.alert("You don't have permission to view this page");
      return false;
    }
  }
}
