import {Injectable,} from '@angular/core';
import {BehaviorSubject,Subject, Observable} from 'rxjs';
import {FetchDataService} from './fetch-data.service';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  public productsSubject = new BehaviorSubject<any>(null);
  public userChange=new Subject<void>()
  constructor(private fetchDataService: FetchDataService) {
  }

  getProducts(endPoint:string,val: string):Observable<any>{
    return this.fetchDataService.fetchData(endPoint,val);
  }

}

