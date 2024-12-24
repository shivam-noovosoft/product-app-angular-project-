import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {User} from '../models/users.models';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from './api.service';

@Injectable({providedIn: 'root'})
export class AuthService implements CanActivate {

  isUserLoggedIn: boolean = false;
  isUserPresent!: User
  limit: number = 30;


  allUsers = new BehaviorSubject<any>(null);
  baseUrl: string = 'https://dummyjson.com/users';

  constructor(
    private router: Router,
    private apiCallsService: ApiService
  ) {
  }

  canActivate(): boolean {

    this.isUserPresent = JSON.parse(<string>localStorage.getItem('loggedUserData'));
    this.isUserLoggedIn = !!this.isUserPresent;

    if (!this.isUserLoggedIn) {
      void this.router.navigate(['login'])
      return false
    }
    return true;
  }

  getUsers(): Observable<any> {
    return this.apiCallsService.get(`${this.baseUrl}`, this.limit, 0)
  }

  loginUser(userName: string, password: string): Observable<any> {
    const data = {username: userName, password: password}
    return this.apiCallsService.post(`${this.baseUrl}/login`, data)
  }

}


