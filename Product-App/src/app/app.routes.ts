import {Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {ProductListComponent} from './components/product-list/product-list.component';
import {LoginComponent} from './components/login/login.component';
import {CartItemsComponent} from './components/cart-items/cart-items.component';
import {GuardService} from './guards/guard.service';

export const routes: Routes = [
  {path: '', component: AppComponent, title: 'App-Page'},
  {path: 'login', component: LoginComponent, title: 'Login-Page'},
  {path: '', redirectTo: 'login', pathMatch: 'full'},
  {
    path: 'products', component: ProductListComponent, title: 'Product-details',
    canActivate: [GuardService]
  },
  {
    path: 'cart',
    // component:CartItemsComponent,
    loadComponent: () => import('./components/cart-items/cart-items.component').then(m => m.CartItemsComponent),
    title: 'cart-items',
    canActivate: [GuardService]
  }
]
