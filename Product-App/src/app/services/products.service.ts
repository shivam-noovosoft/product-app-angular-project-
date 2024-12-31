import {Injectable,} from '@angular/core';
import {BehaviorSubject, Observable, Subject} from 'rxjs';
import {ApiService} from './api.service';
import {Product} from '../models/products.models';
import {Params} from '@angular/router';
import {HttpClient} from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  baseUrl: string = 'https://dummyjson.com/products'
  public productsSubject = new BehaviorSubject<Product[] | null>(null);
  productAddedNotification=new Subject<void>();

  constructor(
    private apiService: ApiService,
    private http:HttpClient,
  ) {
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

  addProduct(data:Record<string, any>):Observable<any>{
    return this.apiService.post(`${this.baseUrl}/add`,data)
  }

  getNewProductImage(category:string):Observable<any> {
    const baseUrl=`https://api.pexels.com/v1/search`
    return this.http.get(baseUrl,{
      params:{query:category,per_page:1},
      headers:{'Authorization': 'Rk4xg6EiPSn5yhedNW5WmNm6wRGRrPcs3KudvYjYuLj2vtIqkcI4ZTYm'}})
  }


}


