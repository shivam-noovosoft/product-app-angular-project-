import {Component, OnInit} from '@angular/core';
import {switchMap, tap} from 'rxjs';
import {FormControl, FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms';
import {ProductsService} from '../../services/products.service';
import {Category, ProductResponse} from '../../models/products.models';
import {NgForOf, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {User, UserResponse} from '../../models/users.models';
import {UserAuthService} from '../../services/auth.service';
import {LoggedUserService} from '../../services/loggedUser.service';
import {UserChangedNotificationService} from '../../services/notification.service';
import {NgSelectComponent, NgOptionComponent,} from '@ng-select/ng-select';


@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    FormsModule,
    NgForOf,
    NgOptionComponent,
    NgIf,
    ReactiveFormsModule,
    NgSelectComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  categories!: Category[]
  selectedCategory!: string
  loggedUserData!: User;
  users!: User[];
  isRouteToCartActive: boolean = false;
  selectUser: any;
  limit: number = 15
  skip: number = 0
  isLoading!: boolean;

  searchValue = new FormControl<string>('')

  constructor(
    private productsService: ProductsService,
    protected router: Router,
    private userAuthService: UserAuthService,
    protected loggedUserService: LoggedUserService,
    private userChangedNotificationService: UserChangedNotificationService,
  ) {
  }

  ngOnInit() {

    this.getLoggedUserData()
    this.searchValue.valueChanges?.pipe(
      tap(() => this.isLoading = true),
      switchMap(searchValue => {
        return this.productsService.getProductsBySearch('products/search', this.limit, this.skip, searchValue as string)
      })
    ).subscribe((val: ProductResponse) => {
      this.isLoading = false;
      this.productsService.productsSubject.next(val.products)
    })

  }

  getProductByCategory(category: NgModel) {
    if (!category) {
      return
    }
    this.productsService.getProductsByCategory(`products/category/${category}`, this.limit, this.skip).subscribe((products: ProductResponse) => {
      this.productsService.productsSubject.next(products.products);
    })
  }

  resetCategorySelect() {
    this.productsService.getProducts('products', this.limit, this.skip).subscribe((products: ProductResponse) => {
      this.productsService.productsSubject.next(products.products);
    })
  }

  fetchCategories() {
    this.productsService.getProductsByCategory('products/categories', this.limit, this.skip).subscribe(category => {
      if (category) {
        this.categories = category;
      }
    })
  }

  getUserCartItems() {
    const user = this.loggedUserService.get()
    void this.router.navigate([`/cart/${user.id}`])
    this.isRouteToCartActive = true;
  }

  private getLoggedUserData() {
    this.loggedUserData = this.loggedUserService.get();
    this.fetchCategories()
    this.setUsers()
  }

  protected logout() {
    localStorage.removeItem('loggedUserData')
    this.userAuthService.userAuth = false;
    void this.router.navigate(['/login'])
  }

  private fetchUsers() {
    this.userAuthService.getUsers().subscribe(
      (value: UserResponse) => this.userAuthService.allUsers.next(value.users),
    )
  }

  private updateUsers() {
    this.userAuthService.allUsers.subscribe((users: User[]) => {
      this.users = users;
    })
  }

  private setUsers() {
    if (this.loggedUserData.role === "admin") {
      this.fetchUsers()
      this.updateUsers()
      return;
    }
  }

  protected backToProductPage() {
    void this.router.navigate(['/products'])
    this.isRouteToCartActive = false;
  }

  protected adminSelectedUser(user: User) {
    this.loggedUserService.set(user)
    this.userChangedNotificationService.userChangedNotification.next()
  }

}

























