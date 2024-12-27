import {Component, Input} from '@angular/core';
import {Product} from '../../models/products.models';
import {CurrencyPipe, NgIf} from '@angular/common';
import {Ellipses} from '../../pipes/ellipses';
import {producerMarkClean} from '@angular/core/primitives/signals';
@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [
    CurrencyPipe, Ellipses, NgIf
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent{

  @Input() product!: Product;

  protected readonly producerMarkClean = producerMarkClean;
}
