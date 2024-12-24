import {Component, OnInit} from '@angular/core';
import {switchMap} from 'rxjs';
import {FormControl, FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms';
import {ProductsService} from '../../services/products.service';
import {Category, ProductResponse} from '../../models/products.models';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {User, UserResponse} from '../../models/users.models';
import {AuthService} from '../../services/auth.service';
import {LoggedUserService} from '../../services/loggedUser.service';
import {NotificationService} from '../../services/notification.service';
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
  skipProducts: number = 0

  searchValue = new FormControl<string>('')

  constructor(
    private productsService: ProductsService,
    protected router: Router,
    private authService: AuthService,
    protected loggedUserService: LoggedUserService,
    private notificationService: NotificationService,
  ) {
  }

  ngOnInit() {
    this.getLoggedUserData();
    this.searchValue.valueChanges?.pipe(
      switchMap(searchValue => {
        return this.productsService.getProductsBySearch(this.limit, this.skipProducts, searchValue as string)
      })
    ).subscribe((val: ProductResponse) => {
      this.productsService.productsSubject.next(val.products)
    })

  }

  getProductByCategory(category: NgModel) {
    if (!category) {
      return
    }
    this.notificationService.categoryChangedNotification.next()
    void this.router.navigate([`products`], {queryParams: {category: category}})

  }

  resetCategorySelect(category: string) {
    this.notificationService.categoryChangedNotification.next()
    void this.router.navigate([`products`], {queryParams: {category: 'all'}})
  }

  fetchCategories() {
    this.productsService.getProductsByCategory(this.limit, this.skipProducts).subscribe(category => {
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
    this.fetchUsers()
  }

  protected logout() {
    localStorage.removeItem('loggedUserData')
    this.authService.isUserLoggedIn = false;
    void this.router.navigate(['/login'])
  }

  private fetchUsers() {
    if (this.loggedUserData.role === "admin") {
      this.authService.getUsers().subscribe(
        (value: UserResponse) => this.authService.allUsers.next(value.users),
      )
      this.authService.allUsers.subscribe((users: User[]) => {
        this.users = users;
      })
      return;
    }
  }

  protected backToProductPage() {
    void this.router.navigate(['/products'],{queryParams:{category:'all'}})
    this.isRouteToCartActive = false;
  }

  protected adminSelectedUser(user: User) {
    this.loggedUserService.set(user)
    this.notificationService.userChangedNotification.next()
  }

}

























