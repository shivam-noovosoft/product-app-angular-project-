import {Injectable} from '@angular/core';
import {CanActivate,Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService implements CanActivate{

  auth:boolean=false;
  constructor(private router: Router) {
  }
  canActivate():boolean{
    if(!this.auth){
      this.router.navigate(['login']).then();
      return false
    }
    return true;
  }
}


@Injectable({providedIn: 'root'})
export class CartAuthService implements CanActivate{
  childAuth:boolean=false;
  constructor(private router: Router) {}

  canActivate():boolean{
    if(!this.childAuth){
    this.router.navigate(['home']).then()
      return false
    }
    return true;
  }
}

