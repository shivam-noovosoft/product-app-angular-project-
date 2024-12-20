import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class VoidFnService {
  notification = new Subject<void>()
}
