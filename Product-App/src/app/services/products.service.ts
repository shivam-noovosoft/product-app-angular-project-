import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  baseUrl:string='https://dummyjson.com/products/'
  public productsSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
  }

  getProducts(endPoint:string,val: string):Observable<any>{
    return this.http.get(`${this.baseUrl}${endPoint}`, {params: {q: val}})
  }

}

