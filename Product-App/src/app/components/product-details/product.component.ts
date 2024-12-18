import {AfterViewInit, Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product, ProductResponse} from '../../models/products.models';
import {User} from '../../models/users.models';
import {FetchDataService} from '../../services/fetch-data.service';


@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [NgForOf, ProductCardComponent, NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  userCart: Product[] = [];
  loggedUser!: User
  filteredProductList!: Product[];

  constructor(
    @Inject(ProductsService) private productService: ProductsService,
    private fetchDataService: FetchDataService
  ) {
  }

  ngOnInit() {
    this.fetchProducts();
    this.updateProducts()
    this.getLoggedUserData()
    this.updateUserCartFromLocalStorage()
    this.filterProductList()
  }

  addToCart(item: Product) {
    this.userCart.push(item)
    const user = JSON.parse(<string>localStorage.getItem('loggedUserData'))
    localStorage.setItem(`${user.id}`, JSON.stringify(this.userCart))
  }

  removeFromCart(item: Product) {
    console.log(item)
    const user = JSON.parse(<string>localStorage.getItem('loggedUserData'))
    const cart = JSON.parse(<string>localStorage.getItem(`${user.id}`))
    console.log(cart.indexOf(item))
    // cart.splice(cart.indexOf(item),1)
    // console.log(cart)
  }

  private updateProducts() {
    this.productService.productsSubject.subscribe((products: Product[]) => {
      console.log(products)
      if (!products) {
        return;
      }
      this.products = products;
    })
  }

  private fetchProducts() {
    this.productService.getProducts('products', '').subscribe((products: ProductResponse) => {
      this.productService.productsSubject.next(products.products);
    })
  }

  private updateUserCartFromLocalStorage() {
    const localSto = JSON.parse(<string>localStorage.getItem(`${this.loggedUser.id}`))
    if (!localSto) {
      return;
    }
    this.userCart = JSON.parse(<string>localStorage.getItem(`${this.loggedUser.id}`));
  }

  getLoggedUserData() {
    this.loggedUser = JSON.parse(<string>localStorage.getItem('loggedUserData'))
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
    const user = JSON.parse(<string>localStorage.getItem('loggedUserData'))
    let cartItems = JSON.parse(<string>localStorage.getItem(`${user.id}`))
    if(!cartItems){
      cartItems=[]
      this.filteredProductList=this.products
      return;
    }
    this.filteredProductList = this.products.map(product => {
      const isItemIncluded = cartItems.some((item: Product) => item.id === product.id)
      if (isItemIncluded) {
        return {...product, inCart: isItemIncluded}
      }
      return product
    })
    this.productService.productsSubject.next(this.filteredProductList)
  }

}






























