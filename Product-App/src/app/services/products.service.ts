import {Injectable,} from '@angular/core';
import {BehaviorSubject,Subject, Observable} from 'rxjs';
import {ApiService} from './api.service';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = 'https://dummyjson.com/'
  public productsSubject = new BehaviorSubject<any>(null);


  constructor(private fetchDataService: ApiService) {
  }

  getProducts(endPoint:string,limit:number,skip:number):Observable<any>{
    const url=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(url,limit,skip);
  }

  getProductsByCategory(endPoint:string,limit:number,skip:number):Observable<any>{
    const url=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(url,limit,skip);
  }

  getProductsBySearch(endPoint:string,limit:number,skip:number,val: string):Observable<any>{
    const url=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(url,limit,skip,val);
  }
}


