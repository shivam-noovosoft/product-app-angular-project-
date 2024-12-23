import {Component, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product, ProductResponse} from '../../models/products.models';
import {User} from '../../models/users.models';
import {LoggedUserService} from '../../services/loggedUser.service';
import {LoaderComponent} from '../loader/loader.component';
import {UserChangedNotificationService} from '../../services/notification.service';


@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [NgForOf, ProductCardComponent, NgIf, AsyncPipe, LoaderComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  userCart: Product[] = [];
  loggedUser!: User
  isLoading!: boolean;
  filteredProductList: Product[] = [];
  limit: number = 15;
  skip: number = 0

  constructor(
    private productService: ProductsService,
    private loggedUserService: LoggedUserService,
    private userChangeNotification: UserChangedNotificationService
  ) {
  }

  ngOnInit() {
    this.init();
  }

  private init() {
    this.getLoggedUserData();
    this._fetchProducts();
    this._updateProducts()
  }

  protected addToCart(item: Product) {
    console.log('adding')
    const user = this.loggedUserService.get()
    const inCart = this.userCart.find(product => product.id === item.id)
    let itemFromList = this.filteredProductList.find(product => product.id === item.id)
    if (!inCart) {
      this.userCart.push({...item, quantity: 1})
      itemFromList!.quantity = 1
      itemFromList!.inCart = true
    } else {
      inCart.quantity++
      itemFromList!.quantity++
    }
    localStorage.setItem(`${user.id}`, JSON.stringify(this.userCart))
  }

  protected removeFromCart(item: Product) {

    const loggedUser = this.loggedUserService.get()
    const deleteItem = this.userCart.find((product: Product) => product.id === item.id);
    let itemFromList = this.filteredProductList.find(product => product.id === item.id)

    if (deleteItem?.quantity === 1) {
      const index = this.userCart.findIndex((product: Product) => product.id === item.id)
      itemFromList!.inCart = false
      this.userCart.splice(index, 1)
    } else {
      deleteItem!.quantity -= 1;
      itemFromList!.quantity--
    }
    localStorage.setItem(`${loggedUser.id}`, JSON.stringify(this.userCart))

  }


  private _fetchProducts() {

    this.productService.getProducts('products', this.limit, this.skip).subscribe((products: ProductResponse) => {
      this.productService.productsSubject.next(products.products);
    })
    this.productService.productsSubject.subscribe((products: Product[]) => {
      if (!products) {
        return;
      }
      this.products = products;
      this.filterProductList()
    })

  }

  private getLoggedUserData() {

    this.loggedUser = this.loggedUserService.get()
    this.updateUserCartFromLocalStorage(this.loggedUser)

  }

  private _updateProducts() {

    this.userChangeNotification.userChangedNotification.subscribe(() => {
      this.getLoggedUserData()
      this.filterProductList()
    })

  }

  private updateUserCartFromLocalStorage(user: User) {

    const userCart = JSON.parse(<string>localStorage.getItem(`${user.id}`))

    if (userCart === null || userCart === undefined) {
      this.userCart = []
      this.filteredProductList = this.products
      return;
    }
    this.userCart = JSON.parse(<string>localStorage.getItem(`${this.loggedUser.id}`));
  }

  protected fetchNextProducts() {

    this.skip += 15
    this._fetchProducts()
    this.filterProductList()

  }

  protected fetchPreviousProducts() {

    this.skip -= 15
    this._fetchProducts()
    this.filterProductList()

  }

  private filterProductList() {

    this.isLoading = true;
    this.filteredProductList = this.products.map(product => {
      const isItemIncluded = this.userCart.find((item: Product) => item.id === product.id)
      if (isItemIncluded) {
        return {...isItemIncluded, inCart: true}
      } else {
        return {...product, inCart: false, quantity: 0}
      }
    })
    this.isLoading = false;

  }

}








