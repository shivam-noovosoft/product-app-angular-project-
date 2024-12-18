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
export class NavbarComponent implements AfterViewInit, OnInit,OnDestroy{

  searchVal!: string
  selectedCategory!: Category;
  categories!: Category[]
  loggedUserData!:User;
  users!: User[];
  routeToCart:boolean=false;
  selectUser:any
  @ViewChild('searchValue') searchValue!: FormControl;

  constructor(
    private productsService: ProductsService,
    private router:Router,private authService:AuthService,
    private usersService: UsersService,
    private cartAuthService:CartAuthService

  ) {
  }

  ngOnInit() {
    this.fetchCategories()
    this.getLoggedUserData()
    this.setUsers()
  }

  ngAfterViewInit() {
      this.searchValue.valueChanges?.pipe(
        switchMap(searchValue => {
          return this.productsService.getProducts('products/search', searchValue)
        })
      ).subscribe((val:ProductResponse) => this.productsService.productsSubject.next(val.products))
  }
  ngOnDestroy() {
    this.routeToCart=false
  }

  getProductByCategory(val: NgModel) {
    this.productsService.getProducts(`products/category/${val.value}`, '').subscribe((products:ProductResponse) => {
      this.productsService.productsSubject.next(products.products);
    })
  }

  resetSelect() {
    this.productsService.getProducts('products', '').subscribe((products:ProductResponse) => {
      this.productsService.productsSubject.next(products.products);
    })
  }

  fetchCategories() {
    this.productsService.getProducts('products/categories', '').subscribe(category => {
      if (category) {
        this.categories = category;
      }
    })
  }

  getUserCartItems(){
    this.cartAuthService.childAuth=true;
    const user=JSON.parse(<string>localStorage.getItem('loggedUserData'))
    this.router.navigate([`/home/cart/${user.id}`]).then()
    this.routeToCart=true;
  }

  private getLoggedUserData(){
    this.loggedUserData=JSON.parse(<string>localStorage.getItem('loggedUserData'))
  }

  protected logout(){
    localStorage.removeItem('loggedUserData')
    this.authService.auth=true;
    this.router.navigate(['/login']).then()
  }

  private fetchUsers() {
    this.usersService.getUsers('users', '').subscribe(
      (value: UserResponse) => this.usersService.allUsers.next(value.users),
    )
  }

  private updateUsers(){
    this.usersService.allUsers.subscribe((users:User[])=>{
      this.users= users;
    })
  }

  private setUsers(){
    if(this.loggedUserData.firstName==="admin"){
      this.fetchUsers()
      this.updateUsers()
      return;
    }
    return;
  }

  protected backToProductPage(){
    this.router.navigate(['home']).then()
    this.routeToCart=false;
  }

  protected adminSelectedUser(user:User){
    localStorage.setItem('loggedUserData',JSON.stringify(user))
  }

}

























