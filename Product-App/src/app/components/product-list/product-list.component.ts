import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product, ProductResponse} from '../../models/products.models';
import {User} from '../../models/users.models';
import {UserService} from '../../services/user.service';
import {LoaderComponent} from '../loader/loader.component';
import {debounceTime, finalize} from 'rxjs';
import {ActivatedRoute, Params} from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [NgForOf, ProductCardComponent, NgIf, LoaderComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  userCart: Product[] = [];
  loggedUser!: User
  isLoading: boolean = false;
  filteredProductList: Product[] = [];
  limit: number = 15;
  skipProducts: number = 0
  queryParams!: Params;

  constructor(
    private productService: ProductsService,
    private userService: UserService,
    private route: ActivatedRoute,
  ) {
  }

  ngOnInit() {
    this.init();
  }

  private init() {

    this.getLoggedUserData();
    this._fetchProductsViaParams();
    this._updateProducts();

  }

  protected addToCart(item: Product) {

    const user = this.userService.get()
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

    const loggedUser = this.userService.get()
    const itemToBeDeleted = this.userCart.find((product: Product) => product.id === item.id);
    let itemFromList = this.filteredProductList.find(product => product.id === item.id)

    if (itemToBeDeleted?.quantity === 1) {
      const index = this.userCart.findIndex((product: Product) => product.id === item.id)
      itemFromList!.inCart = false
      this.userCart.splice(index, 1)
    } else {
      itemToBeDeleted!.quantity -= 1;
      itemFromList!.quantity--
    }
    localStorage.setItem(`${loggedUser.id}`, JSON.stringify(this.userCart))

  }


  private _fetchProducts() {

    console.log('called')
    this.isLoading = true;
    this.productService.getProducts(this.limit, this.skipProducts).pipe(
      debounceTime(500),
      finalize(() => this.isLoading = false)
    ).subscribe((products: ProductResponse) => {
      this.productService.productsSubject.next(products.products);
    })
    this.productService.productsSubject.subscribe(products => {
      if (!products) {
        return;
      }
      this.products = products;
      this.filterProductList();
    })

  }

  private _fetchProductsViaParams() {
    this.route.queryParams.subscribe(params => {
      if (!params['category'] && !params['search']) {
        console.log('in 1')
        this._fetchProducts();
      }
      if (!params['category'] && params['search']) {
        console.log('in 2')
        this._fetchProductsBySearch(params['search']);
      }
      if (!params['search'] && params['category']) {
        console.log('in 3')
        this._fetchProductByCategory(params['category'])
      }
    })
  }

  private _fetchProductsBySearch(searchString: string) {

    this.isLoading = true
    this.productService.getProductsBySearch(this.limit, this.skipProducts, searchString).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe(products => {
      this.route.queryParams.subscribe((params) => {
        if (params['category']) {
          return this.productService.getProductsByCategory(this.limit, this.skipProducts, params['category'])
            .subscribe((products: ProductResponse) => {
              return this.productService.productsSubject.next(products.products);
            })
        }
        if (!params['category']) {
          return this.productService.productsSubject.next(products.products)
        }
        const categorizedItems = products.products.filter((item: Product) => {
          return item.category === params['category']
        })
        this.productService.productsSubject.next(categorizedItems)
      })
      this.productService.productsSubject.subscribe(products => {
        if (!products) {
          return;
        }
        this.products = products;
        this.filterProductList();
      })
    })
  }


  private _fetchProductByCategory(params: Params) {

    this.isLoading = true;
    this.productService.getProductsByCategory(this.limit, this.skipProducts, params).pipe(
      debounceTime(1500),
      finalize(() => this.isLoading = false)
    ).subscribe((products: ProductResponse) => {
      this.productService.productsSubject.next(products.products);
    })
    this.productService.productsSubject.subscribe(products => {
      if (!products) {
        return;
      }
      this.products = products;
      this.filterProductList();
    })

  }


  private getLoggedUserData() {

    this.loggedUser = this.userService.get();
    this.updateUserCartFromLocalStorage(this.loggedUser);

  }

  private _updateProducts() {

    this.userService.userChangedNotification.subscribe(() => {
      this.getLoggedUserData();
      this.filterProductList();
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

    this.skipProducts += 15
    this._fetchProducts();
    this.filterProductList();

  }

  protected fetchPreviousProducts() {

    this.skipProducts -= 15
    this._fetchProducts();
    this.filterProductList();

  }

  private filterProductList() {

    this.filteredProductList = this.products.map(product => {
      const isItemIncluded = this.userCart.find((item: Product) => item.id === product.id)
      if (isItemIncluded) {
        return {...isItemIncluded, inCart: true}
      } else {
        return {...product, inCart: false, quantity: 0}
      }
    })
  }

}








