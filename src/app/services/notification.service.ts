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

  public showNewVersion() {
    const notif = this.notifications.create("Neue Version verfügbar", "Klicken um zu aktualisieren", NotificationType.Info, {
      timeOut: 6000,
      showProgressBar: true
    });
    notif.click.subscribe(v => {
      document.location.reload();
    });
  }

  public showGCMNotification(payload: {title: string; body: string; icon: string}) {

    const html = `
      <div class="HTMLnotification">
      <div class="img">
      <img src="${payload.icon}">
</div>
<div class="text">
  <div class="title">
  ${payload.title}
</div>
<div class="body">
      ${payload.body}
</div>
</div>
        </div>
          `;
    this.notifications.html(html,NotificationType.Bare, {
      timeOut: 4000,
      showProgressBar: true
    });
  }
}


