import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product, ProductResponse} from '../../models/products.models';
import {User} from '../../models/users.models';
import {UserService} from '../../services/user.service';
import {LoaderComponent} from '../loader/loader.component';
import {debounceTime, finalize} from 'rxjs';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {Cart, CartItems} from '../../models/carts.models';
import {CartService} from '../../services/cart.service';


@Component({
  standalone: true,
  selector: 'app-product-list',
  imports: [NgForOf, ProductCardComponent, NgIf, LoaderComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  userCartItem!: CartItems;
  currentUser!: User
  isLoading: boolean = false;
  filteredProductList: Product[] = [];
  limit: number = 15;
  skipProducts: number = 0

  constructor(
    private productService: ProductsService,
    private userService: UserService,
    private route: ActivatedRoute,
    private cartService: CartService,
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

    if (this.userCartItem.products.length === 0) {
      item.quantity = 1
      let itemFromList = this.filteredProductList.find(product => product.id === item.id)
      this.cartService.addToCart(item).subscribe({
        next: response => {
          itemFromList!.inCart = true
          this.userCartItem.products.push(item)
          // this.userCartItem.totalQuantity=1
          this.userCartItem = response
          this.cartService.cartItems.next(response)
        },
        error: err => console.log(err)
      })
    } else {
      const inCart = this.userCartItem.products.find(product => product.id === item.id)
      let itemFromList = this.filteredProductList.find(product => product.id === item.id)

      if (inCart) {
        inCart.quantity++
        this.cartService.updateCart(inCart, this.userCartItem.id).subscribe({
          next: response => {
            itemFromList!.quantity++
            this.userCartItem = response
            this.cartService.cartItems.next(response)
          },
          error: () => alert('can not add item')
        })
      } else {
        item.quantity++
        this.cartService.updateCart(item, this.userCartItem.id).subscribe({
          next: response => {
            itemFromList!.inCart = true
            this.userCartItem = response
            //this.userCartItem.products.push(item)
            this.cartService.cartItems.next(response)
          },
          error: () => alert('can not add item')
        })
      }
    }
  }

  protected removeFromCart(item: Product) {

    const itemToBeDeleted = this.userCartItem.products.find((product: Product) => product.id === item.id);
    let itemFromList = this.filteredProductList.find(product => product.id === item.id)
    if (itemToBeDeleted?.quantity === 1) {
      const index = this.userCartItem.products.findIndex((product: Product) => product.id === item.id)
      this.userCartItem.products.splice(index, 1)
      itemFromList!.inCart = false
      itemFromList!.quantity = 0
      itemToBeDeleted.quantity = 0
    } else {
      itemToBeDeleted!.quantity--
      itemFromList!.quantity--
    }
    this.userCartItem.totalQuantity--
    this.cartService.cartItems.next(this.userCartItem)

  }


  private _fetchProductsViaParams() {

    this.route.queryParams.subscribe(params => {

      if (!params['category'] && !params['search']) {
        this._fetchProducts();
      }
      if (!params['search'] && params['category']) {
        this._fetchProductByCategory(params['category'])
      }
      if (!params['category'] && params['search'] || (params['search'] && params['category'])) {
        this._fetchProductsBySearch(params['search']);
      }

    })

  }

  private _fetchProducts() {

    this.isLoading = true;
    this.productService.getProducts(this.limit, this.skipProducts).pipe(
      debounceTime(500),
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (products: ProductResponse) => {
        this.productService.productsSubject.next(products!.products);
        this.filterProductList(products.products);
      },
      error: (err) => console.log(err)
    })
    this.productService.productsSubject.subscribe(products => {
      if (!products) {
        return;
      }
      this.products = products;
    })

  }


  private _fetchProductsBySearch(searchString: string) {

    this.isLoading = true
    this.productService.getProductsBySearch(this.limit, this.skipProducts, searchString).pipe(
      finalize(() => this.isLoading = false)
    ).subscribe({
      next: (products: ProductResponse) => {
        this.route.queryParams.subscribe((params) => {
          if (params['category']) {
            const categorizedItems = products.products.filter((item: Product) => {
              return item.category === params['category']
            })
            this.filterProductList(categorizedItems)
            this.productService.productsSubject.next(categorizedItems)
          }
          if (!params['category']) {
            this.filterProductList(products.products)
            return this.productService.productsSubject.next(products.products)
          }
        })
      },
      error: (err) => console.log(err),
    })
    this.productService.productsSubject.subscribe((products: Product[] | null) => {
      if (!products) {
        return;
      }
      this.products = products;
    })
  }


  private _fetchProductByCategory(params: Params) {
    this.isLoading = true;
    this.productService.getProductsByCategory(this.limit, this.skipProducts, params).pipe(
      debounceTime(1500),
      finalize(() => this.isLoading = false)
    ).subscribe((products: ProductResponse) => {
      this.filterProductList(products.products);
      this.productService.productsSubject.next(products.products);
    })
    this.productService.productsSubject.subscribe(products => {
      if (!products) {
        return;
      }
      this.products = products;
    })
  }

  private getLoggedUserData() {
    this.userService.currentUser.subscribe(user => {
      this.currentUser = user
    })
    this.updateUserCartFromLocalStorage();
  }


  private updateUserCartFromLocalStorage() {


    this.cartService.getUserCartItems(this.currentUser.id).subscribe((cart: Cart) => {
      if (cart.carts.length <= 0) {
        this.cartService.cartItems.next({userId: this.currentUser.id, products: [], totalQuantity: 0,})
        this.userCartItem = {userId: this.currentUser.id, products: [], totalQuantity: 0,}
      } else {
        this.cartService.cartItems.next(cart.carts[0])
        this.userCartItem = cart.carts[0]
      }
      this._fetchProductsViaParams()
    })

  }

  private _updateProducts() {
    this.userService.userChangedNotification.subscribe(() => {
      this.getLoggedUserData();
    })
  }

  protected fetchNextProducts() {
    this.skipProducts += 15
    this._fetchProducts();
  }

  protected fetchPreviousProducts() {
    this.skipProducts -= 15
    this._fetchProducts();
  }

  private filterProductList(products: Product[]) {

    this.filteredProductList = products.map(product => {
      const isItemIncluded = this.userCartItem.products.find((item: Product) => item.id === product.id)
      if (isItemIncluded) {
        return {...isItemIncluded, inCart: true}
      } else {
        return {...product, inCart: false, quantity: 0}
      }
    })
  }

}








