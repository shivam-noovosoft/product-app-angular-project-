import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, finalize, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private http: HttpClient) {
  }

  get(string: string, limit: number, skip: number, queryParams?: string): Observable<unknown> {


    if (queryParams === null || queryParams === undefined) {
      return this.http.get(string, {params: {limit: limit, skip: skip}})
    }
    return this.http.get(string, {
      params: {q: queryParams, limit: limit, skip: skip}
    })

  }

  post(string: string, data: Record<string, string>): Observable<unknown> {
    return this.http.post(string, data);
  }

}

