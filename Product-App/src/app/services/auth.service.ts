import {Injectable, OnInit} from '@angular/core';
import {User} from '../models/users.models';
import {Observable} from 'rxjs';
import {ApiService} from './api.service';
import {GuardService} from './guard.service';
import {Router} from '@angular/router';

@Injectable({providedIn: 'root'})
export class AuthService{

  baseUrl: string = 'https://dummyjson.com/users';

  constructor(
    private apiService: ApiService,
    private guardService: GuardService,
    private router: Router
  ) {
  }

  loginUser(userName: string, password: string): Observable<any> {
    const data = {username: userName, password: password}
    return this.apiService.post(`${this.baseUrl}/login`, data)
  }

  logoutUser() {
    localStorage.removeItem('loggedUserData')
    this.guardService.isGuardActive = false;
    void this.router.navigate(['/login'])
  }

}


