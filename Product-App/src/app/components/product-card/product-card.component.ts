import {Component, Input} from '@angular/core';

@Component({
  standalone:true,
  selector: 'app-product-card',
  imports: [],
  templateUrl: './product-card.component.html',
  styleUrl: './product-card.component.css'
})
export class ProductCardComponent{

  @Input() product: any;

}
