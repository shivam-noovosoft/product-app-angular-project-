import {Component, OnInit} from '@angular/core';
import {debounceTime, switchMap} from 'rxjs';
import {FormControl, FormsModule, NgModel, ReactiveFormsModule} from '@angular/forms';
import {ProductsService} from '../../services/products.service';
import {Category, ProductResponse} from '../../models/products.models';
import {NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {User, UserResponse} from '../../models/users.models';
import {UserService} from '../../services/user.service';
import {NgSelectComponent, NgOptionComponent,} from '@ng-select/ng-select';
import {AuthService} from '../../services/auth.service';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    FormsModule,
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
  selectedCategory!: string | null
  loggedUserData!: User;
  currentUserData!: User;
  users!: User[];
  selectUser: any;
  limit: number = 15
  skipProducts: number = 0
  cartItemCount: number = 0
  searchValue = new FormControl<string>('')

  constructor(
    private productsService: ProductsService,
    protected router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService:AuthService
  ) {
  }

  ngOnInit() {
    this.getLoggedUserData();
    this.searchValue.valueChanges.pipe(
      debounceTime(500),
      switchMap(val => {
        return this.router.navigate(['products'], {queryParams: {search: val}})
      })
    ).subscribe();

    this.route.queryParams.subscribe((params) => {
      if (!params['category'] && !params['search']) {
        this.searchValue.setValue('')
        this.selectedCategory = null
      }
      if (!params['search']) {
        this.searchValue.setValue('')
      }
      if (!params['category']) {
        this.selectedCategory = null
      }
      this.selectedCategory = params['category'];
      this.searchValue.setValue(params['search'])
    })

  }

  getProductByCategory(category: NgModel) {
    if (!category) {
      return
    }
    void this.router.navigate([`products`], {queryParams: {category: category}})

  }

  resetCategorySelect() {
    void this.router.navigate([`products`])
  }

  fetchCategories() {
    this.productsService.getCategories(this.limit, this.skipProducts).subscribe(category => {
      if (category) {
        this.categories = category;
      }
    })
  }

  getUserCartItems() {
    void this.router.navigate([`/cart/${this.currentUserData.id}`])
  }

  private getLoggedUserData() {
    this.loggedUserData = JSON.parse(<string>localStorage.getItem('loggedUserData'))
    this.userService.currentUser.subscribe(user=>{
      this.currentUserData=user
    })
    this.fetchCategories()
    this.fetchUsers()
  }

  protected logout() {
    this.authService.logoutUser()
  }

  private fetchUsers() {
    if (this.loggedUserData.role === "admin") {
      this.userService.getUsers().subscribe(
        (value: UserResponse) => this.userService.allUsers.next(value.users),
      )
      this.userService.allUsers.subscribe((users: User[]) => {
        this.users = users;
      })
    }
  }

  protected backToProductPage() {
    void this.router.navigate(['/products'])
  }

  protected adminSelectedUser(user: User) {
    this.userService.set(user)
    this.userService.userChangedNotification.next()
  }

}

























