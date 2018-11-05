import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NotificationService} from './notification.service';

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private hasNewVersion = new BehaviorSubject(false);
  constructor(private notify: NotificationService) {
  }

  public $hasNewVersion(){
    return this.hasNewVersion;
  }

  public hasUpdate(){
    this.hasNewVersion.next(true);
    this.notify.showNewVersion();
  }


}
