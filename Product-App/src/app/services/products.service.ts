import {Injectable,} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {ApiService} from './api.service';
import {Product} from '../models/products.models';
import {Params} from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = 'https://dummyjson.com/products'
  public productsSubject = new BehaviorSubject<Product[] | null>(null);


  constructor(private apiService: ApiService) {
  }

  getProducts(limit: number, skip: number): Observable<any> {
    return this.apiService.get(this.baseUrl, limit, skip);
  }

  getCategories(limit: number, skip: number): Observable<any> {
    return this.apiService.get(`${this.baseUrl}/categories`, limit, skip)
  }

  getProductsByCategory(limit: number, skip: number, endpoint?: Params): Observable<any> {
    const url = `${this.baseUrl}/category/${endpoint}`
    return this.apiService.get(url, limit, skip);
  }

  getProductsBySearch(limit: number, skip: number, queryParam: string): Observable<any> {
    const url = queryParam ? `${this.baseUrl}/search` : `${this.baseUrl}`
    return this.apiService.get(url, limit, skip, queryParam);
  }
}


