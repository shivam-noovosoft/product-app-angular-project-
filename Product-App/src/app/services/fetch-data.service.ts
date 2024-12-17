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

  fetchData(endPoint: string, val: string): Observable<unknown> {
    // if (!val) {
    //   return this.http.get(`${this.baseUrl}${endPoint}`)
    // }
    return this.http.get(`${this.baseUrl}${endPoint}`,
      {
        params: {q: val, limit: this.limit, skip: this.skip}
      });
  }
}
