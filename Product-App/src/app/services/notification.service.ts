import {Injectable} from '@angular/core';
import {Subject} from 'rxjs';

@Injectable({providedIn: 'root'})
export class NotificationService {
  userChangedNotification = new Subject<void>()
  categoryChangedNotification = new Subject<void>()
}
