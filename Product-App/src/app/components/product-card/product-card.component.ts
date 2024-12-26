import {Component, Input} from '@angular/core';
import {Product} from '../../models/products.models';
import {CurrencyPipe} from '@angular/common';
import {Ellipses} from '../../pipes/ellipses';
@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [
    CurrencyPipe, Ellipses
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent{

  @Input() product!: Product;

}
