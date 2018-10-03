import {Injectable} from '@angular/core';
import {NotificationsService as ns, NotificationType} from 'angular2-notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(private notifications: ns) {

  }

  public show(message: string, type: NotificationType, content?: string) {
    this.notifications.create(message, content ? content : '', type, {
      timeOut: 3000,
      showProgressBar: false
    });
  }
}
