import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';
import {User} from '../models/users.models';

@Injectable({providedIn: 'root'})
class LoggedUserService {
  loggedUserData = new Subject<User>()
}
