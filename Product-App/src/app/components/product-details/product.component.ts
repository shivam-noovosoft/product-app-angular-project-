import {AfterViewInit, Component, Inject, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product} from '../../models/products.models';

@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [NgForOf, AsyncPipe, ProductCardComponent],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: Product[] = [];

  constructor(@Inject(ProductsService) private productService: ProductsService) {
  }

  ngOnInit() {
    this.fetchProducts();

    this.productService.productsSubject.subscribe(products => {
      this.products = products.products;
    })
  }

  private fetchProducts() {
    this.productService.getProducts('https://dummyjson.com/products/search', '').subscribe(products => {
      this.productService.productsSubject.next(products);
    })
  }
}






























