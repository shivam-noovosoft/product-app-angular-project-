import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {BehaviorSubject, finalize, Observable} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiCallsService {

  limit: number = 15;
  skip: number = 0;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  constructor(private http: HttpClient) {
  }

  get(string:string, queryParams: string): Observable<unknown> {
    this.loadingSubject.next(true);
    if (queryParams === null || queryParams === undefined) {
      return this.http.get(string).pipe(
        finalize(() => this.loadingSubject.next(false)),
      )
    }
      return this.http.get(string, {
        params: {q: queryParams, limit: this.limit, skip: this.skip}
      }).pipe(
        finalize(()=>finalize(() => this.loadingSubject.next(false)),)
      );
  }

  post(string:string,data:Record<string, string>):Observable<unknown>{
    return this.http.post(string,data).pipe(
      finalize(() => this.loadingSubject.next(false)),
    );
  }

}

// <div *ngIf="loading$ | async" class="loader">Loading...</div>
// <div *ngIf="!loading$ | async">
//   <!-- Your content goes here -->
// </div>
