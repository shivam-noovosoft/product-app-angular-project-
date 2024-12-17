import {Component, Inject, Input, OnDestroy, OnInit} from '@angular/core';
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
  }


  addToUserCart(userId:number,item:Product) {
    this.userCart.push(item)
    localStorage.setItem(`${userId}`, JSON.stringify(this.userCart))
  }

  private updateProducts() {
    this.productService.productsSubject.subscribe((products: Product[]) => {
      this.products = products;
    })
  }

  private fetchProducts() {
    this.productService.getProducts('products/search', '').subscribe((products: ProductResponse) => {
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
  }

  protected fetchPreviousProducts() {
    this.fetchDataService.skip -= 15
    this.fetchProducts()
    this.updateProducts()
  }

}






























