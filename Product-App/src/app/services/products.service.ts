import {Injectable,} from '@angular/core';
import {BehaviorSubject,Subject, Observable} from 'rxjs';
import {ApiCallsService} from './api-calls.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseUrl: string = 'https://dummyjson.com/'
  public productsSubject = new BehaviorSubject<any>(null);
  public userChange=new Subject<void>()
  constructor(private fetchDataService: ApiCallsService) {
  }

  getProducts(endPoint:string):Observable<any>{
    const string=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(string,'');
  }

  getProductsByCategory(endPoint:string):Observable<any>{
    const string=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(string,'');
  }

  getProductsBySearch(endPoint:string,val: string):Observable<any>{
    const str=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(str,val);
  }
}

