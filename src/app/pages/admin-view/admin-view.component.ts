import {Component, OnInit} from '@angular/core';
import {AngularFireDatabase} from '@angular/fire/database';
import {AuthService} from '../../services/auth.service';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, switchMap, take} from 'rxjs/operators';
import {forkJoin, of} from 'rxjs';
import {NgForm} from '@angular/forms';
import {NotificationType} from 'angular2-notifications';
import {NotificationService} from '../../services/notification.service';

@Component({
  selector: 'app-admin-view',
  templateUrl: './admin-view.component.html',
  styleUrls: ['./admin-view.component.scss']
})
export class AdminViewComponent implements OnInit {

  public wishes = null;
  public users = null;

  public bookings = [];

  constructor(private db: AngularFireDatabase, private authService: AuthService, private fs: AngularFirestore, private notif: NotificationService) {
  }

  ngOnInit() {

    this.users = this.fs.collection('users').snapshotChanges().pipe(map(v => {
      const userChanges = [];
      this.bookings = [];
      for (let i = 0; i < v.length; i++) {
        const vElement = v[i];
        userChanges.push(vElement.payload.doc.data());
        this.fs.collection(vElement.payload.doc.ref.path + '/bookings').valueChanges().pipe(take(1)).subscribe((bookings: any) => {
          for (let j = 0; j < bookings.length; j++) {
            const booking = bookings[j];
            booking.booker = vElement.payload.doc.data();
            booking.booker.path = vElement.payload.doc.ref.path;
            booking.dueDate = booking.dueDate.toDate();
            this.bookings.push(booking);
          }
        });
      }
      return userChanges;
    }));

    this.wishes = this.fs.collection('drink-wishes').snapshotChanges().pipe(switchMap(v => {
      const creator = [];
      for (let i = 0; i < v.length; i++) {
        const vElement: any = v[i];
        creator.push(vElement.payload.doc.data().creator.get());
      }
      if (v.length > 0) {
        return forkJoin(creator).pipe(map(data => {
          return {wishes: v, data: data};
        }));
      } else {
        return of({wishes: v, data: []});
      }
    }), map(joinedData => {
      const wishes = [];
      for (let i = 0; i < joinedData.data.length; i++) {
        const wishData: any = joinedData.wishes[i].payload.doc.data();
        wishes.push({
          name: wishData.name,
          creator: joinedData.data[i].data(),
          ref: joinedData.wishes[i].payload.doc.ref
        });
      }
      return wishes;
    }));
  }


  addNotification(uid, payload) {
    this.db.object('/messages/' + uid + '/' + this.fs.createId()).set({
      body: payload.body,
      title: payload.title,
      img: payload.img,
      click_action: '/prices'
    }).then(v => {
      //console.log('Success: ', v);
    }, console.error);
  }

  deleteWish(wish) {
    this.fs.doc(wish.ref).delete();
  }

  addNotificationWithForm(addForm: NgForm) {
    //console.log(addForm);
    if (addForm.valid && addForm.value.users.length > 0) {
      for (let i = 0; i < addForm.value.users.length; i++) {
        const user = addForm.value.users[i];
        this.addNotification(user, {body: addForm.value.body, title: addForm.value.title, img: addForm.value.img});
      }
    }
  }

  cancelBooking(booking: any, index?: number) {
    this.updatePackagePlaces(booking.persons, true).then(value => {
      this.fs.collection(booking.booker.path + '/bookings/').doc(booking.bookingId).delete().then(v => {
        this.notif.show('Reservierung gelöscht', NotificationType.Success);
        this.bookings.splice(index, 1);
      }, e => {
        this.notif.show('Reservierung konnte nicht gelöscht werden', NotificationType.Error);
        console.log('Error: ', e);
      });
    }, e => {
      this.notif.show('Reservierung konnte nicht gelöscht werden', NotificationType.Error);
      console.log('Error: ', e);
    });

  }

  updatePackagePlaces(persons, add) {
    return new Promise((resolve, reject) => {
      this.fs.collection('rest-places').snapshotChanges().pipe(take(1)).subscribe((packageInfo:any) => {
        const packageRef = packageInfo[0].payload.doc.ref;
        packageInfo = packageInfo[0].payload.doc.data();
        for (const person of persons) {
          packageInfo[person.package].current30 += person.startNight === 30 && !person.noSleep ? (add ? 1 : -1) : 0;
          packageInfo[person.package].current31 += person.startNight === 31 && !person.noSleep || person.startNight === 30 && person.nights === 2 && !person.noSleep ? (add ? 1 : -1) : 0;
          if (packageInfo[person.package].current30 < 0 || packageInfo[person.package].current31 < 0) {
            reject();
            return;
          }
        }
        this.fs.doc(packageRef).update(packageInfo).then(v => {
          resolve();
        }, reject);
      }, reject);
    });
  }

  acceptBooking(booking: any) {
    this.fs.collection(booking.booker.path + '/bookings/').doc(booking.bookingId).update({paid: true}).then(v => {
      this.fs.doc(booking.booker.path).update({zusage: 100}).then(() => {
        booking.paid = true;
        this.notif.show('Buchung akzeptiert', NotificationType.Success);
      });
    }, e => {
      this.notif.show('Buchung konnte nicht akzeptiert werden', NotificationType.Error);
      console.log('Error: ', e);
    });
  }


}
