import {AfterViewInit, Component, DoCheck, Inject, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product, ProductResponse} from '../../models/products.models';
import {User} from '../../models/users.models';
import {FetchDataService} from '../../services/fetch-data.service';
import {LoggedUserService} from '../../services/loggedUser.service';


@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [NgForOf, ProductCardComponent, NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit,AfterViewInit,DoCheck {

  products: Product[] = [];
  userCart: Product[] = [];
  loggedUser!: User
  filteredProductList!: Product[];

  constructor(
    @Inject(ProductsService) private productService: ProductsService,
    private fetchDataService: FetchDataService,
    private loggedUserService: LoggedUserService
  ) {
  }

  ngOnInit() {
    this.init();
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
    this.userCart.push(item)
    const user = JSON.parse(<string>localStorage.getItem('loggedUserData'))
    localStorage.setItem(`${user.id}`, JSON.stringify(this.userCart))
  }

  removeFromCart(item: Product) {
    const user = JSON.parse(<string>localStorage.getItem('loggedUserData'))
    const cart = JSON.parse(<string>localStorage.getItem(`${user.id}`))
  }

  private fetchProducts() {
    this.productService.getProducts('products', '').subscribe((products: ProductResponse) => {
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
    this.loggedUserService.loggedUser.subscribe((loggedUser: User) => {
      if (!loggedUser) {
        return;
      }
      this.loggedUser = loggedUser
      this.updateUserCartFromLocalStorage()
    })
  }

  private updateUserCartFromLocalStorage() {
    const localSto = JSON.parse(<string>localStorage.getItem(`${this.loggedUser.id}`))
    if (localSto===null || localSto===undefined) {
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
      const isItemIncluded = this.userCart.some((item: Product) => item.id === product.id)
      return {...product, inCart: isItemIncluded}
    })
    this.productService.productsSubject.next(this.filteredProductList)
  }

}






























