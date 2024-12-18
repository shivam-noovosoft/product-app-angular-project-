import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FetchDataService {

  baseUrl: string = 'https://dummyjson.com/'
  limit: number = 15;
  skip: number = 0;

  constructor(private http: HttpClient) {
  }

  fetchData(endPoint: string, queryParams: string): Observable<unknown> {
    if (queryParams === null || queryParams === undefined) {
      console.log('without queryParams');
      return this.http.get(`${this.baseUrl}${endPoint}`)
    }
      return this.http.get(`${this.baseUrl}${endPoint}`, {
        params: {q: queryParams, limit: this.limit, skip: this.skip}
      });
  }
}
