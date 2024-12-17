import {Component, Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, GuardResult, MaybeAsync, RouterStateSnapshot} from '@angular/router';

@Injectable({providedIn: 'root'})

export class AuthService implements CanActivate{
  auth:boolean=true;
  canActivate():boolean{
    return this.auth;
  }
}
