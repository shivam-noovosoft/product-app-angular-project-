import {Component, Input, OnInit} from '@angular/core';
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
export class CartItemsComponent implements OnInit {

  @Input() userId!: number;
  cartItems: Product[]=[];
  url!:any
  constructor(private route: ActivatedRoute) {
  }

  ngOnInit() {
    this.getLoggedUserData()
    this.route.url.subscribe(val=>{
    this.url=val
    })
  }

  getLoggedUserData() {
    this.cartItems=JSON.parse(<string>localStorage.getItem(`${this.userId}`))
  }

}
