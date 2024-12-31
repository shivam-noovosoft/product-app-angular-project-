import {Component, Input, OnInit} from '@angular/core';
import {Product} from '../../models/products.models';
import {ProductCardComponent} from '../product-card/product-card.component';
import {NgForOf, NgIf} from '@angular/common';
import {User} from '../../models/users.models';
import {UserService} from '../../services/user.service';
import {CartService} from '../../services/cart.service';
import {CartItems} from '../../models/carts.models';

@Component({
  standalone: true,
  selector: 'app-cart-items',
  imports: [ProductCardComponent, NgForOf, NgIf],
  templateUrl: './cart-items.component.html',
  styleUrl: './cart-items.component.css'
})
export class CartItemsComponent implements OnInit {

  @Input() userId!: number;
  cartItems!: CartItems | null;
  filteredCartItems!: CartItems|null;
  currentUser!: User

  constructor(
    private userService: UserService,
    private cartService: CartService,
  ) {
  }

  ngOnInit() {

    this.userService.currentUser.subscribe(user => {
      this.currentUser = user
    })

    this._getCurrentUserCart()

  }

  private _getCurrentUserCart() {

    this.cartService.cartItems.subscribe(cartItems => {
      this.cartItems = cartItems
      this.filteredCartItems = this.cartItems
    })

  }

  deleteItem(item: Product) {
    const deleteItem = this.filteredCartItems?.products.find((product: Product) => product.id === item.id);
    if (deleteItem?.quantity === 1) {
      const index = this.filteredCartItems!.products.findIndex((product: Product) => product.id === item.id)
      this.filteredCartItems!.products.splice(index, 1)
    } else {
      deleteItem!.quantity -= 1;
    }

    const itemToBeDeleted = this.filteredCartItems?.products.find((product: Product) => product.id === item.id);
    if (itemToBeDeleted?.quantity === 1) {
      const index = this.filteredCartItems!.products.findIndex((product: Product) => product.id === item.id)
      this.filteredCartItems?.products.splice(index, 1)
    } else {
      itemToBeDeleted!.quantity--
    }
    this.filteredCartItems!.totalQuantity--
    this.cartService.cartItems.next(this.filteredCartItems)

  }

  addItem(item: Product) {
    const itemToBeAdded = this.filteredCartItems?.products.find(product => product.id === item.id)
    itemToBeAdded!.quantity++
    this.cartService.updateCart(itemToBeAdded, this.filteredCartItems!.id).subscribe({
      next: response => {
        itemToBeAdded!.quantity++
        this.filteredCartItems = response
        this.cartService.cartItems.next(response)
      },
      error: () => alert('can not add item')
    })

  }

}
