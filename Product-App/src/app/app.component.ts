import {Component} from '@angular/core';
import {Router, RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ProductComponent} from './components/product-details/product.component';
import {NgIf} from '@angular/common';

@Component({
  standalone:true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ProductComponent, NgIf,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent{

  constructor(private router: Router) {
  }

  get isLogin(){
    return this.router.url==='/login';
  }

}
