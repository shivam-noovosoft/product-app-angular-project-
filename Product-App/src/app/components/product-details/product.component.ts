import {AfterViewInit, Component, DoCheck, Inject, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product, ProductResponse} from '../../models/products.models';
import {User} from '../../models/users.models';
import {ApiCallsService} from '../../services/api-calls.service';
import {LoggedUserService} from '../../services/loggedUser.service';
import {VoidFnService} from '../../services/filteredProductList.service';


@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [NgForOf, ProductCardComponent, NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit, AfterViewInit, DoCheck {

  products: Product[] = [];
  userCart: Product[] = [];
  loggedUser!: User
  filteredProductList!: Product[];

  constructor(
    @Inject(ProductsService) private productService: ProductsService,
    private fetchDataService: ApiCallsService,
    private loggedUserService: LoggedUserService,
    private voidFnService: VoidFnService
  ) {
  }

  ngOnInit() {
    this.init();
    this.voidFnService.notification.subscribe(val => {
      this.getLoggedUserData()
    })
  }

  ngDoCheck() {
    this.filterProductList()
  }

  ngAfterViewInit() {
    this.getLoggedUserData()
  }

  private init() {
    this.fetchProducts();
    this.updateProducts();
  }

  addToCart(item: Product) {
    const user = this.loggedUserService.get()
    const inCart = this.userCart.find(product => product.id === item.id)
    if (!inCart) {
      this.userCart.push({...item, quantity: 1})
    } else {
      inCart.quantity++
    }
    localStorage.setItem(`${user.id}`, JSON.stringify(this.userCart))
  }

  removeFromCart(item: Product) {
    const loggedUser = this.loggedUserService.get()
    const deleteItem = this.userCart.find((product: Product) => product.id === item.id);
    if (deleteItem?.quantity === 1) {
      const index = this.userCart.findIndex((product: Product) => product.id === item.id)
      this.userCart.splice(index, 1)
    } else {
      deleteItem!.quantity -= 1;
    }
    localStorage.setItem(`${loggedUser.id}`, JSON.stringify(this.userCart))
    this.filterProductList()
  }

  private fetchProducts() {
    this.productService.getProducts('products').subscribe((products: ProductResponse) => {
      this.productService.productsSubject.next(products.products);
    })
  }

  private updateProducts() {
    this.productService.productsSubject.subscribe((products: Product[]) => {
      if (!products) {
        return;
      }
      this.products = products;
    })
  }

  getLoggedUserData() {
    this.loggedUser = this.loggedUserService.get()
    this.updateUserCartFromLocalStorage()
  }

  private updateUserCartFromLocalStorage() {
    const localSto = JSON.parse(<string>localStorage.getItem(`${this.loggedUser.id}`))
    if (localSto === null || localSto === undefined) {
      this.userCart = []
      this.filteredProductList = this.products
      return;
    }
    this.userCart = JSON.parse(<string>localStorage.getItem(`${this.loggedUser.id}`));
    this.filterProductList()
  }

  protected fetchNextProducts() {
    this.fetchDataService.skip += 15
    this.fetchProducts()
    this.updateProducts()
    this.filterProductList()
  }

  protected fetchPreviousProducts() {
    this.fetchDataService.skip -= 15
    this.fetchProducts()
    this.updateProducts()
    this.filterProductList()
  }

  private filterProductList() {
    this.filteredProductList = this.products.map(product => {
      const isItemIncluded = this.userCart.find((item: Product) => item.id === product.id)
      if(isItemIncluded){
      return {...isItemIncluded, inCart: true}
      }else{
      return {...product, inCart: false,quantity:0}
      }
    })
  }

}








