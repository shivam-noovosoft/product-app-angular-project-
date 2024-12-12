import {Component} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ProductComponent} from './components/product-details/product.component';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent,ProductComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

}
