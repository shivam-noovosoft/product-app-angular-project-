import {Component, OnInit, TemplateRef} from '@angular/core';
import {debounceTime,switchMap} from 'rxjs';
import {FormControl, FormGroup, FormsModule, NgModel, ReactiveFormsModule, Validators} from '@angular/forms';
import {ProductsService} from '../../services/products.service';
import {Category} from '../../models/products.models';
import {AsyncPipe, NgIf} from '@angular/common';
import {ActivatedRoute, Router} from '@angular/router';
import {User, UserResponse} from '../../models/users.models';
import {UserService} from '../../services/user.service';
import {NgSelectComponent, NgOptionComponent,} from '@ng-select/ng-select';
import {AuthService} from '../../services/auth.service';
import {CartService} from '../../services/cart.service';
import {CartItems} from '../../models/carts.models';
import {NgbModal, NgbModalRef} from '@ng-bootstrap/ng-bootstrap';


@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    FormsModule,
    NgOptionComponent,
    NgIf,
    ReactiveFormsModule,
    NgSelectComponent,
    AsyncPipe
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
  cartItems!: CartItems | null;
  isRoutedToCart: boolean = false;
  modalRef: NgbModalRef | undefined;
  successMessage: string = ''
  newProductImage: Record<string, any> | null = null
  isNewProductAdded:boolean=false
  searchValue = new FormControl<string>('')


  constructor(
    private productsService: ProductsService,
    protected router: Router,
    private userService: UserService,
    private route: ActivatedRoute,
    private authService: AuthService,
    private cartService: CartService,
    private modalService: NgbModal
  ) {
  }

  ngOnInit() {
    this._getLoggedUserData();
    this._setFields()
    this.searchValue.valueChanges.pipe(
      debounceTime(500),
      switchMap(val => {
        return this.router.navigate(['products'], {queryParams: {category: this.selectedCategory, search: val}})
      })
    ).subscribe();

    this.cartService.cartItems.subscribe(cartItems => {
      this.cartItems = cartItems
    })

  }

  newProductForm = new FormGroup({
    title: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required,]),
    category: new FormControl(null, [Validators.required]),
    price: new FormControl('', [Validators.required, Validators.min(0)]),
    rating: new FormControl('', [Validators.required, Validators.max(5)]),
    image: new FormControl(''),
  })


  private _setFields() {

    this.route.queryParams.subscribe((params) => {
      if (this.router.url.includes('cart')) {
        return;
      }
      this.selectedCategory = params['category']
      this.searchValue.setValue(params['search'])
    })

  }


  protected getProductByCategory(category: NgModel) {
    void this.router.navigate([`products`], {queryParams: {category: category}})
  }

  protected resetCategorySelect() {
    void this.router.navigate([`products`])
  }

  private _fetchCategories() {
    this.productsService.getCategories(this.limit, this.skipProducts).subscribe(category => {
      this.categories = category;
    })
  }

  protected getUserCartItems() {

    this.isRoutedToCart = true;
    // void this.router.navigate([`cart`],{queryParamsHandling:'merge'})
    void this.router.navigate([`cart`])
  }

  private _getLoggedUserData() {
    this.loggedUserData = JSON.parse(<string>localStorage.getItem('loggedUserData'))
    this.userService.currentUser.subscribe(user => {
      this.currentUserData = user
    })
    this._fetchCategories()
    this._fetchUsers()
  }

  protected logout() {
    this.authService.logoutUser()
  }

  private _fetchUsers() {

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
    void this.router.navigate(['products'], {
      queryParams: {
        search: this.searchValue.value,
        category: this.selectedCategory
      }
    })
  }

  protected adminSelectedUser(user: User) {
    this.userService.set(user)
    this.userService.userChangedNotification.next()
  }

  protected openAddNewProductModal(content: TemplateRef<any>) {
    this.modalRef = this.modalService.open(content, {centered: true, size: 'sm'})
  }

  protected closeAddNewProductModal() {
    this.modalRef?.dismiss()
    this.newProductForm.reset()
  }

  protected getNewProductImage(category: string | null | undefined) {
    if (!category) {
      return;
    }
    this.productsService.getNewProductImage(category).subscribe({
      next: (response) => {
        this.newProductImage = {src: response.photos[0]['src'].original, url: response.photos[0]['url']}
      },
      error: (err) => console.log(err)
    })

  }

  protected addNewProduct() {
    this.isNewProductAdded=true
    this.newProductForm.get('image')?.setValue(JSON.stringify(this.newProductImage))
    this.productsService.addProduct(this.newProductForm.value).subscribe({
      next: () => {
        localStorage.setItem('newProduct', JSON.stringify(this.newProductForm.value))
        this.productsService.productAddedNotification.next()
        this.newProductForm.reset()
        this.newProductImage = null
        this.isNewProductAdded=false
      },
      error: (err) => alert(err.message),
    })

  }

}

























