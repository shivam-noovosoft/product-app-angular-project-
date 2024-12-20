import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService implements CanActivate {

  auth: boolean = true;

  constructor(private router: Router) {
  }

  canActivate(): boolean {
    if (!this.auth) {
      void this.router.navigate(['login'])
      return false
    }
    return true;
  }
}


@Injectable({providedIn: 'root'})
export class CartAuthService implements CanActivate {

  cartAuth: boolean = false;

  constructor(private router: Router) {
  }

  canActivate(): boolean {
    if (!this.cartAuth) {
      void this.router.navigate(['home'])
      return false
    }
    return true;
  }
}

