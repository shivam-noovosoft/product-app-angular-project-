import {AfterViewInit, Component, Input, OnChanges, OnInit} from '@angular/core';
import {Product} from '../../models/products.models';
import {ProductCardComponent} from '../product-card/product-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {LoggedUserService} from '../../services/loggedUser.service';
import {User} from '../../models/users.models';

@Component({
  standalone: true,
  selector: 'app-cart-items',
  imports: [ProductCardComponent, NgForOf, NgIf],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css'
})
export class CartItemsComponent implements OnChanges {

  @Input() userId!: number;
  cartItems: Product[] = [];
  filteredCartItems: Product[] = [];

  constructor(
    private loggedUserService: LoggedUserService,
  ) {
  }

  ngOnChanges() {
    this.getLoggedUserData()
  }

  getLoggedUserData() {
    const userId = JSON.parse(<string>localStorage.getItem(`${this.userId}`))
    if (userId === null || userId == undefined) {
      this.cartItems = []
    } else {
      this.cartItems = JSON.parse(<string>localStorage.getItem(`${this.userId}`))
      this.filteredCartItems = this.cartItems
    }
  }

  deleteItem(item: Product) {
    const loggedUser = this.loggedUserService.get()
    const deleteItem = this.filteredCartItems.find((product: Product) => product.id === item.id);
    if (deleteItem?.quantity === 1) {
      const index = this.filteredCartItems.findIndex((product: Product) => product.id === item.id)
      this.filteredCartItems.splice(index, 1)
    } else {
      deleteItem!.quantity -= 1;
    }
    localStorage.setItem(`${loggedUser.id}`, JSON.stringify(this.filteredCartItems))
  }

  addItem(item: Product) {
    const user = this.loggedUserService.get()
    const itemToAdd = this.filteredCartItems.find(product => product.id === item.id)
    itemToAdd!.quantity++
    localStorage.setItem(`${user.id}`, JSON.stringify(this.filteredCartItems))
  }

}
