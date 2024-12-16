import {Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {ProductComponent} from './components/product-details/product.component';
import {LoginComponent} from './components/login/login.component';

export const routes: Routes = [
  {path: 'login',component: LoginComponent, title: 'Login-Page'},
  {path: '',redirectTo:'login', pathMatch: 'full'},
  {path: 'home', component: AppComponent, title: 'Home-Page'},
  {path: 'products/:userId', component: ProductComponent, title: 'Product-details'}
]
