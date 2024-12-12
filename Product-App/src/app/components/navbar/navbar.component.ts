import {Component, ViewChild, AfterViewInit, OnInit} from '@angular/core';
import {ProductsService} from '../../services/products.service';
import {FormControl, FormsModule} from '@angular/forms';
import {switchMap} from 'rxjs';


@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [
    FormsModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements AfterViewInit, OnInit {

  searchVal!: string
  @ViewChild('searchValue') searchValue!: FormControl;

  constructor(private productsService: ProductsService) {
  }

  ngOnInit() {
    this.productsService.getProducts('https://dummyjson.com/products/categories','').subscribe(products => {

    })
  }

  ngAfterViewInit() {
    this.searchValue.valueChanges?.pipe(
      switchMap(searchValue => {
        return this.productsService.getProducts('https://dummyjson.com/products/search', searchValue)
      })
    ).subscribe(val => this.productsService.productsSubject.next(val))
  }

}

























