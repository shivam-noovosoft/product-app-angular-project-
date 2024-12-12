import {Routes} from '@angular/router';
import {AppComponent} from './app.component';
import {Profiler} from 'node:inspector';
import {ProductComponent} from './components/product-details/product.component';

export const routes: Routes = [
  {path: '', component: AppComponent, title: 'Home-Page'},
  {path: 'home', component: ProductComponent, title: 'Product-details'},
  {path: '', redirectTo: 'home', pathMatch: 'full'},
];
