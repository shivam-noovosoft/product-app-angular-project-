import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  baseUrl:string='https://dummyjson.com/'
  constructor(private http:HttpClient) { }

  fetchData(endPoint:string,val:string):Observable<unknown>{
    return this.http.get(`${this.baseUrl}${endPoint}`,{params:{q:val}})
  }
}
