import {Injectable} from '@angular/core';
import {CanActivate, Router,} from '@angular/router';
import {User} from '../models/users.models';


@Injectable({providedIn: 'root'})
export class GuardService implements CanActivate {

  isGuardActive = false;
  isUserPresent!: User

  constructor(private router: Router) {
  }

  canActivate(): boolean {

    this.isUserPresent = JSON.parse(<string>localStorage.getItem('loggedUserData'));

    if (!this.isUserPresent) {
      void this.router.navigate(['login'])
      return false
    }
    this.isGuardActive=true
    return true;

  }

}
