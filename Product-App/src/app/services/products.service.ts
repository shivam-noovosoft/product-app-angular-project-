import {Injectable,} from '@angular/core';
import {BehaviorSubject,Subject, Observable} from 'rxjs';
import {ApiService} from './api.service';
import {NgModel} from '@angular/forms';
import {Product} from '../models/products.models';
import {Params} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = 'https://dummyjson.com/products'
  public productsSubject = new BehaviorSubject<Product[]|null>(null);


  constructor(private fetchDataService: ApiService) {
  }

  getProducts(limit:number,skip:number):Observable<any>{
    return this.fetchDataService.get(this.baseUrl,limit,skip);
  }

  getProductsByCategory(limit:number,skip:number,endpoint?:Params):Observable<any>{
   const url=  endpoint ? `${this.baseUrl}/category/${endpoint}` : `${this.baseUrl}/categories`
    return this.fetchDataService.get(url,limit,skip);
  }

  getProductsBySearch(limit:number,skip:number,queryParam: string):Observable<any>{
    const url=queryParam ? `${this.baseUrl}/search` : `${this.baseUrl}`
    return this.fetchDataService.get(url,limit,skip,queryParam);
  }
}


