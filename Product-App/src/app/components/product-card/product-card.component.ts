import {Component, Input} from '@angular/core';
import {Product} from '../../models/products.models';
import {CurrencyPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Ellipses} from '../../pipes/ellipses';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [
    CurrencyPipe, Ellipses, NgOptimizedImage, NgIf
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent{

  @Input() product!: Product;

}
