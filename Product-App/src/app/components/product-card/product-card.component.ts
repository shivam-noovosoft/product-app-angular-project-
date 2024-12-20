import {Component, Input, Output, EventEmitter, inject, OnInit} from '@angular/core';
import {Product} from '../../models/products.models';
import {CurrencyPipe, NgIf, NgOptimizedImage} from '@angular/common';
import {Ellipses} from '../../pipes/ellipses';
import {ApiService} from '../../services/api.service';

@Component({
  standalone: true,
  selector: 'app-product-card',
  imports: [
    CurrencyPipe, Ellipses, NgOptimizedImage, NgIf
  ],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent implements OnInit{

  @Input() product!: Product;

  apiService=inject(ApiService)
  loading: boolean=true;

  ngOnInit() {
    this.apiService.loadingSubject.subscribe((data) => {
      this.loading=data
    })
  }

}
