import {Injectable, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, Observable, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {

  public productsSubject = new BehaviorSubject<any>(null);

  constructor(private http: HttpClient) {
  }

  getProducts(url:string,val: string):Observable<any>{
    return this.http.get(url, {params: {q: val}})
  }

}

