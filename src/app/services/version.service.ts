import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {NotificationService} from './notification.service';
import {SwUpdate} from "@angular/service-worker";

@Injectable({
  providedIn: 'root'
})
export class VersionService {

  private hasNewVersion = new BehaviorSubject(false);
  private updating = new BehaviorSubject(false);
  constructor(private notify: NotificationService,
              private updates: SwUpdate) {
  }

  public $hasNewVersion() {
    return this.hasNewVersion;
  }

  public hasUpdate() {
    this.hasNewVersion.next(true);
    this.notify.showNewVersion(()=>{
      this.update();
    })
  }

  public update() {
    this.updating.next(true);
    this.updates.activateUpdate().then(() => {
        document.location.reload();
      this.updating.next(false);
    });
  }


  $updating() {
    return this.updating;
  }
}
