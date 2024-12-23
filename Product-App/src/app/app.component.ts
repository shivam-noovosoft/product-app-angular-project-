import {Component} from '@angular/core';
import {RouterOutlet} from '@angular/router';
import {NavbarComponent} from './components/navbar/navbar.component';
import {ProductComponent} from './components/product-details/product.component';
import {NgIf} from '@angular/common';
import {LoginComponent} from './components/login/login.component';
import {UserAuthService} from './services/auth.service';

@Component({
  standalone: true,
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, ProductComponent, NgIf, LoginComponent,],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {

  constructor(protected userAuthService: UserAuthService) {
  }

}

