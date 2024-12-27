import {Injectable} from '@angular/core';
import {BehaviorSubject, Observable} from 'rxjs';
import {CartItems} from '../models/carts.models';
import {ApiService} from './api.service';

@Injectable({providedIn: 'root'})
export class CartService {

  baseUrl: string = 'https://dummyjson.com/carts';

  cartItems = new BehaviorSubject<CartItems | null>(null)

  constructor(
    private apiService: ApiService
  ) {
  }

  getUserCartItems(userId: number): Observable<any> {
    return this.apiService.get(`${this.baseUrl}/user/${userId}`, 30, 0)
  }

  addToCart(requestData: any):Observable<any> {
    const data = {
      userId: 1,
      products: [{id:requestData.id, quantity: requestData.quantity},]
    }
    return this.apiService.post(`${this.baseUrl}/add`,data)
  }

  updateCart(requestData: any,cartId?:number):Observable<any> {
    const data = {
      merge:true,
      userId: 1,
      products: [{id:requestData.id, quantity: requestData.quantity},]
    }
    return this.apiService.put(`${this.baseUrl}/${cartId}`, data)
  }

}
