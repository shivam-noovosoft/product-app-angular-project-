import {Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {ProductComponent} from './components/product-details/product.component';
import {LoginComponent} from './components/login/login.component';
import {AuthService} from './services/auth.service';
import {CartItemsComponent} from './components/cart-items/cart-items.component';


export const routes: Routes = [
  {path: '', component: AppComponent, title: 'App-Page'},
  {path: 'login', component: LoginComponent, title: 'Login-Page'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'products', component: ProductComponent, title: 'Product-details',
    canActivate: [AuthService]
  },
  {
    path: 'cart/:userId', component: CartItemsComponent, title: 'cart-items',
    canActivate: [AuthService]
  }
]
