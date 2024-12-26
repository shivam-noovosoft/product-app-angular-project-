import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ApiService} from './api.service';
import {User} from '../models/users.models';


@Injectable({providedIn: 'root'})
export class UserService {

  allUsers = new BehaviorSubject<any>(null);
  baseUrl: string = 'https://dummyjson.com/users';
  limit:number=30;
  loggedUser:User=JSON.parse(<string>localStorage.getItem("loggedUserData"));

  userChangedNotification = new Subject<void>()

  constructor(
    private apiCallsService: ApiService
  ) {
  }

  set(user:User){
    this.loggedUser=user;
  }

  get(){
    return this.loggedUser
  }

  getUsers(): Observable<any> {
    return this.apiCallsService.get(`${this.baseUrl}`, this.limit, 0)
  }

}
