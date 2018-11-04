import {CanActivate} from '@angular/router';
import {Injectable} from '@angular/core';
import {AuthService} from '../services/auth.service';
import {map, skipWhile, take} from 'rxjs/operators';

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(private userService: AuthService) {
  };

  canActivate() {
    return this.userService.getUserObservable().pipe( skipWhile((v, index) => {
      return !v && index === 0;
    }), take(1), map(v => v && v.admin));
  }
}
