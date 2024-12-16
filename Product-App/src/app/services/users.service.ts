import { Injectable } from '@angular/core';
import {FetchDataService} from './fetch-data.service';
import {BehaviorSubject, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  public allUsers=new BehaviorSubject<any>(null);
  constructor(private fetchDataService: FetchDataService ) { }

  getUsers(endPoint:string,val:string):Observable<any>{
    return this.fetchDataService.fetchData(endPoint,val)
  }


}
