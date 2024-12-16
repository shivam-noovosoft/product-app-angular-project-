import {Component, Inject, OnInit} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf} from '@angular/common';
import {ProductsService} from '../../services/products.service';
import {ProductCardComponent} from '../product-card/product-card.component';
import {Product} from '../../models/products.models';
import {Response} from '../../models/products.models';
@Component({
  standalone: true,
  selector: 'app-product-details',
  imports: [NgForOf, AsyncPipe, ProductCardComponent, NgIf],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent implements OnInit {

  products: Product[] = [];
  userCart: Product[]=[];
  constructor(@Inject(ProductsService) private productService: ProductsService) {
  }

  ngOnInit() {
    this.fetchProducts();
    this.updateProducts()
    this.updateUserCartFromLocal()
  }

  updateUserCart(item:string){
    this.userCart.push(JSON.parse(item))
    localStorage.setItem('user1',JSON.stringify(this.userCart))
  }

  private updateProducts(){
    this.productService.productsSubject.subscribe(products => {
      this.products = products['products'];
    })
  }

  private fetchProducts() {
    this.productService.getProducts('search', '').subscribe((products:Response) => {
      this.productService.productsSubject.next(products);
    })
  }

  private updateUserCartFromLocal(){
    const localSto=JSON.parse(<string>localStorage.getItem('user1'))
    if(!localSto){
      return;
    }
    this.userCart=JSON.parse(<string>localStorage.getItem('user1'));
  }

}






























