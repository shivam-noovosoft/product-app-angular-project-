import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class FilteredProductListService {
  filteredProductList = new Subject<void>()
}
