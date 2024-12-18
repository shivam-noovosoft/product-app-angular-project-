import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';


@Injectable({providedIn: 'root'})
export class LoggedUserService {
  loggedUser=new BehaviorSubject<any>(null)
}
