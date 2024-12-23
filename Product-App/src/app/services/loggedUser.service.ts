import {Injectable} from '@angular/core';
import {User} from '../models/users.models';


@Injectable({providedIn: 'root'})
export class LoggedUserService {

  loggedUser:User=JSON.parse(<string>localStorage.getItem("loggedUserData"));

  set(user:User){
    this.loggedUser=user;
  }

  get(){
    return this.loggedUser
  }

}

