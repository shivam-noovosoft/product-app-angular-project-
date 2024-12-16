import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {FormControl, FormsModule, NgModel} from '@angular/forms';
import {switchMap} from 'rxjs';
import {Category} from '../../models/products.models';
import {NgForOf} from '@angular/common';
import {
  NgOptionTemplateDirective,
  NgSelectComponent,
  NgLabelTemplateDirective,
  NgOptionComponent,
} from '@ng-select/ng-select';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    FormsModule,
    NgForOf,
    NgOptionTemplateDirective,
    NgLabelTemplateDirective,
    NgSelectComponent,
    NgOptionComponent
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit, OnInit {

  searchVal!: string
  selectedCategory!: Category;
  categories!: Category[]
  @ViewChild('searchValue') searchValue!: FormControl;

  constructor(private productsService: ProductsService) {
  }

  ngOnInit() {
    this.fetchCategories()
  }

  ngAfterViewInit() {
    this.searchValue.valueChanges?.pipe(
      switchMap(searchValue => {
        return this.productsService.getProducts('search', searchValue)
      })
    ).subscribe(val => this.productsService.productsSubject.next(val))
  }

  getProductByCategory(val: NgModel) {
    this.productsService.getProducts(`products/category/${val.value}`, '').subscribe(products => {
      this.productsService.productsSubject.next(products);
    })
  }

  resetSelect() {
    this.productsService.getProducts('', '').subscribe(products => {
      this.productsService.productsSubject.next(products);
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
    console.log(JSON.parse(<string>localStorage.getItem('user1')))
  }

}

























