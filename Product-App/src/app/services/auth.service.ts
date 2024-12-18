import {Component, Injectable} from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  GuardResult,
  MaybeAsync,
  RouterStateSnapshot
} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService implements CanActivate{
  auth:boolean=true;
  canActivate():boolean{
    return this.auth;
  }
}


@Injectable({providedIn: 'root'})
export class CartAuthService implements CanActivate{
  childAuth:boolean=false;
  canActivate():boolean{
    return this.childAuth;
  }
}

