import {Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {Profiler} from 'node:inspector';
import {ProductComponent} from './components/product-details/product.component';
import {LoginComponent} from './components/login/login.component';

export const routes: Routes = [
  {path: '',component: LoginComponent, title: 'Login-Page'},
  {path: 'home', component: AppComponent, title: 'Home-Page'},
  {path: 'products', component: ProductComponent, title: 'Product-details'},
];
