import {Injectable, OnInit} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {User} from '../models/users.models';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from './api.service';

@Injectable({providedIn: 'root'})
export class UserAuthService implements CanActivate {

  userAuth: boolean = false;
  isUserLoggedIn!: User
  limit: number = 30;
  skip: number = 0;

  allUsers = new BehaviorSubject<any>(null);

  constructor(
    private router: Router,
    private apiCallsService: ApiService
  ) {
  }

  canActivate(): boolean {

    this.isUserLoggedIn = JSON.parse(<string>localStorage.getItem('loggedUserData'));
    this.userAuth = !!this.isUserLoggedIn;

    if (!this.userAuth) {
      void this.router.navigate(['login'])
      return false
    }
    return true;
  }

  getUsers(): Observable<any> {
    return this.apiCallsService.get(`https://dummyjson.com/users`, this.limit, this.skip)
  }

  loginUser(userName: string, password: string): Observable<any> {
    const data = {username: userName, password: password}
    return this.apiCallsService.post(`https://dummyjson.com/user/login`, data)
  }

}


