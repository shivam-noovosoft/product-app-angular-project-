import {Component, ViewChild, AfterViewInit, OnInit, OnDestroy} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {FormControl, FormsModule, NgModel} from '@angular/forms';
import {switchMap} from 'rxjs';
import {Category, ProductResponse} from '../../models/products.models';
import {CartAuthService} from '../../services/auth.service';
import {NgForOf, NgIf} from '@angular/common';
import {
  NgOptionTemplateDirective,
  NgSelectComponent,
  NgLabelTemplateDirective,
  NgOptionComponent,
} from '@ng-select/ng-select';
import {Router} from '@angular/router';
import {User, UserResponse} from '../../models/users.models';
import {AuthService} from '../../services/auth.service';
import {UsersService} from '../../services/users.service';
import {LoggedUserService} from '../../services/loggedUser.service';
import {VoidFnService} from '../../services/filteredProductList.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    FormsModule,
    NgForOf,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgSelectComponent,
    NgOptionComponent,
    NgIf
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit, OnDestroy, AfterViewInit {

  selectedCategory!: Category;
  categories!: Category[]
  loggedUserData!: User;
  users!: User[];
  routeToCart: boolean = false;
  selectUser: any;
  @ViewChild('searchValue') searchValue!: FormControl;

  constructor(
    private productsService: ProductsService,
    private router: Router, private authService: AuthService,
    private usersService: UsersService,
    private cartAuthService: CartAuthService,
    protected loggedUserService: LoggedUserService,
    private voidFnService:VoidFnService
  ) {
  }

  ngOnInit() {
    this.getLoggedUserData()
  }

  ngAfterViewInit() {
    // this.searchValue.valueChanges?.pipe(
    //   switchMap(searchValue => {
    //     return this.productsService.getProducts('products/search', searchValue)
    //   })
    // ).subscribe((val:ProductResponse) => this.productsService.productsSubject.next(val.products))
  }

  ngOnDestroy() {
    this.routeToCart = false
    // this.usersService.allUsers.unsubscribe()
  }

  getProductByCategory(event:any) {
    const category = (event.target as HTMLSelectElement).value;
    console.log("Category", category);
    // this.productsService.getProductsByCategory(`products/category/${category}`).subscribe((products: ProductResponse) => {
    //   this.productsService.productsSubject.next(products.products);
    // })
  }

  resetSelect() {
    this.productsService.getProducts('products').subscribe((products: ProductResponse) => {
      this.productsService.productsSubject.next(products.products);
    })
  }

  fetchCategories() {
    this.productsService.getProductsByCategory('products/categories').subscribe(category => {
      if (category) {
        this.categories = category;
      }
    })
  }

  getUserCartItems() {
    this.cartAuthService.childAuth = true;
    const user = this.loggedUserService.get()
    this.router.navigate([`/home/cart/${user.id}`]).then()
    this.routeToCart = true;
  }

  private getLoggedUserData() {
    this.loggedUserData = this.loggedUserService.get();
    this.fetchCategories()
    this.setUsers()
  }

  protected logout() {
    localStorage.removeItem('loggedUserData')
    this.authService.auth = true;
    this.router.navigate(['/login']).then()
  }

  private fetchUsers() {
    this.usersService.getUsers('users', '').subscribe(
      (value: UserResponse) => this.usersService.allUsers.next(value.users),
    )
  }

  private updateUsers() {
    this.usersService.allUsers.subscribe((users: User[]) => {
      this.users = users;
    })
  }

  private setUsers() {
    if (this.loggedUserData.firstName === "admin") {
      this.fetchUsers()
      this.updateUsers()
      return;
    }
    return;
  }

  protected backToProductPage() {
    this.router.navigate(['home']).then()
    this.routeToCart = false;
  }

  protected adminSelectedUser(user: User) {
    this.loggedUserService.set(user)
    this.voidFnService.notification.next()
  }

}

























