import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, finalize, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  get(url: string, limit: number, skip: number, queryParams?: string): Observable<unknown> {


    if (queryParams === null || queryParams === undefined) {
      return this.http.get(url, {params: {limit: limit, skip: skip}})
    }
    return this.http.get(url, {
      params: {q: queryParams, limit: limit, skip: skip}
    })

  }

  post(url: string, data: Record<string, any>): Observable<unknown> {
    return this.http.post(url, data);
  }

  put(url: string, data: Record<string, any>): Observable<unknown> {
    return this.http.put(url, data);
  }


}

