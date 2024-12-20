import { Injectable } from '@angular/core';
import {ApiCallsService} from './api-calls.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public allUsers=new BehaviorSubject<any>(null);
  constructor(private apiCallsService: ApiCallsService ) { }

  getUsers(endPoint:string,val:string):Observable<any>{
    return this.apiCallsService.get(`https://dummyjson.com/${endPoint}`,val)
  }

  loginUser(userName:string,password:string):Observable<any>{
    const data={username:userName,password:password}
    return this.apiCallsService.post(`https://dummyjson.com/user/login`,data)
  }


}
