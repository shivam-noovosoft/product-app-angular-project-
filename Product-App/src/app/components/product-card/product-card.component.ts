import {Component, Input, OnInit, Output, EventEmitter} from '@angular/core';
import {Product} from '../../models/products.models';
import {CurrencyPipe, NgOptimizedImage} from '@angular/common';
import {Ellipses} from '../../pipes/ellipses';
import {setTheme} from 'ngx-bootstrap/utils';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [
    CurrencyPipe, Ellipses, NgOptimizedImage
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent {

  @Input() product!: Product;
  @Output() sendCartData = new EventEmitter<string>();

  constructor() {
    setTheme('bs5')
  }

}
