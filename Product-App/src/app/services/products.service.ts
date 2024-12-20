import {Injectable,} from '@angular/core';
import {BehaviorSubject,Subject, Observable} from 'rxjs';
import {ApiService} from './api.service';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = 'https://dummyjson.com/'
  public productsSubject = new BehaviorSubject<any>(null);
  public filteredProductsSubject = new BehaviorSubject<any>(null);

  constructor(private fetchDataService: ApiService) {
  }

  getProducts(endPoint:string):Observable<any>{
    const string=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(string);
  }

  getProductsByCategory(endPoint:string):Observable<any>{
    const string=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(string,);
  }

  getProductsBySearch(endPoint:string,val: string):Observable<any>{
    const str=`${this.baseUrl}${endPoint}`
    return this.fetchDataService.get(str,val);
  }
}

//change queryparams

