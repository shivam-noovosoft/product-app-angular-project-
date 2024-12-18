import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Product} from '../../models/products.models';
import {ProductCardComponent} from '../product-card/product-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-cart-items',
  imports: [ProductCardComponent, NgForOf, NgIf],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css'
})
export class CartItemsComponent implements OnInit{

  @Input() userId!: number;
  cartItems: Product[]=[];

  ngOnInit() {
    this.getLoggedUserData()
  }

  getLoggedUserData() {
    const userId=JSON.parse(<string>localStorage.getItem(`${this.userId}`))
    if(userId===null || userId==undefined){
      this.cartItems=[]
    }else{
    this.cartItems=JSON.parse(<string>localStorage.getItem(`${this.userId}`))
    }
  }

}
