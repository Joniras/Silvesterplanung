import {Component, OnInit, ViewChild} from '@angular/core';
import {skipWhile, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatStep, MatStepper} from '@angular/material';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {AuthService} from '../../services/auth.service';
import {NotificationService} from '../../services/notification.service';
import {NotificationType} from 'angular2-notifications';
import * as firebase from '../../../../node_modules/firebase';
import Timestamp = firebase.firestore.Timestamp;

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  public pakete: any[];

  @ViewChild('firstStep')
  public firstStep: MatStep = null;
  @ViewChild('secondStep')
  public secondStep: MatStep = null;
  @ViewChild('stepper')
  public stepper: MatStepper = null;

  public persons: FormGroup;
  public acceptAGB: FormGroup;
  public personCounter = 1;
  public currentPersons = [];
  public packageInfoOriginal = null;
  public overviewValue = [];
  public overviewPrice = 0;

  public currentBooking: any = null;
  public pastBookings = [];
  private packageInfoOriginalRef: firebase.firestore.DocumentReference;
  public user = null;
  public bookingInProgress: boolean;

  constructor(private fireStore: AngularFirestore, private _formBuilder: FormBuilder, private authService: AuthService, private notif: NotificationService) {
    this.persons = this._formBuilder.group({});
    this.user = this.authService.getUserObservable();
    this.acceptAGB = this._formBuilder.group({
      accept: new FormControl('', Validators.required)
    });
    this.getPlaces();
    this.authService.getUserObservable().pipe(skipWhile(v => v == null)).subscribe(v => {
      this.addUser(v.originalDisplayName?v.originalDisplayName:v.displayName);
      this.fireStore.collection(v.ref.path + '/bookings').valueChanges().subscribe(bookings => {
        this.pastBookings = bookings.map((booking: any) => {
          const dueDate: Timestamp = booking.dueDate;
          booking.dueDate = dueDate.toDate();
          return booking;
        });
        // console.log('Bookings: ', bookings);
      });
    });
  }

  ngOnInit() {
  }

  getPlaces() {
    this.fireStore.collection('rest-places').snapshotChanges().pipe(take(1)).subscribe(v => {
      // console.log('Current Prices: ', v[0]);
      this.packageInfoOriginal = v[0].payload.doc.data();
      this.packageInfoOriginalRef = v[0].payload.doc.ref;
      const data = [];
      for (let vElementKey in v[0].payload.doc.data()) {
        const elem: any = v[0].payload.doc.data()[vElementKey];
        elem.title = vElementKey;
        data.push(elem);
      }
      data.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0));
      this.pakete = data;
    });
  }

  addUser(name?: string) {
    const formGroup = this._formBuilder.group({
      name: new FormControl(name),
      alcohol: new FormControl(true),
      package: new FormControl(),
      nights: new FormControl(),
      counter: new FormControl(this.personCounter),
      startNight: new FormControl(30),
      noSleep: new FormControl(false)
    });
    this.persons.addControl('person' + (this.personCounter), formGroup);
    this.currentPersons.push(this.personCounter++);
  }

  addRow() {
    console.log(this.persons);
    if (this.persons.valid) {
      this.persons.markAsUntouched();
      this.persons.markAsPristine();
      this.addUser();
    }
  }

  savePersons() {
    this.persons.markAsTouched();
    if (this.persons.valid) {
      this.overviewPrice = 0;
      for (let rawValueKey in this.persons.getRawValue()) {
        const person = this.persons.getRawValue()[rawValueKey];
        //console.log('person: ', person);
        console.log(person.package);
        if (person.package) {
          person.package = person.package.title;
        } else {
          person.package = 'Gamma';
        }
        console.log(person);
        if (person.nights == 2) {
          person.startNight = 30;
        }
        person.price = this.calculatePrice(person);
        this.overviewPrice += person.price;
        this.overviewValue.push(person);
      }
      if (this.overviewValue.length > 0) {
        this.stepper.next();
        this.firstStep.editable = false;
        this.firstStep.completed = true;
      } else {
        this.notif.show('Gib zumindest eine Person ein', NotificationType.Warn);
      }
    } else {
      this.notif.show('Deine Eingaben sind unvollständig', NotificationType.Warn);
    }
  }

  accept() {
    this.bookingInProgress = true;
    this.acceptAGB.controls.accept.setValue('--');
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    this.currentBooking = {price: this.overviewPrice, persons: this.overviewValue, bookingId: this.fireStore.createId(), dueDate: dueDate};
    this.updatePackagePlaces(this.currentBooking.persons, false).then(v => {
      this.fireStore.collection(this.authService.getUser().ref.path + '/bookings/').doc(this.currentBooking.bookingId).set(this.currentBooking).then(booking => {
        this.stepper.next();
        this.secondStep.editable = false;
        this.secondStep.completed = true;
        this.bookingInProgress = false;
      }, e => {
        this.notif.show('Buchen fehlgeschlagen', NotificationType.Error);
        console.log('Error: ', e);
      });
    }, e => {
      this.notif.show('Du scheinst mehr ausgewählt zu haben, als es aktuell noch gibt', NotificationType.Error);
      console.log(e);
    });

  }

  removePerson(counter: number, index: number) {
    this.persons.removeControl('person' + counter);
    this.currentPersons.splice(index, 1);
  }

  private calculatePrice(person: any) {
    console.log(this.packageInfoOriginal);
    const pack = this.packageInfoOriginal[person.package];
    let priceString = 'price';
    if (!person.alcohol) {
      priceString += 'WoAlcohol';
    }
    console.log(person.nights);
    console.log(pack);
    priceString += person.nights;
    return pack[priceString];
  }

  updatePackagePlaces(persons, add) {
    return new Promise((resolve, reject) => {
      this.fireStore.doc(this.packageInfoOriginalRef).valueChanges().pipe(take(1)).subscribe(packageInfo => {
        for (let person of persons) {
          packageInfo[person.package].current30 += person.startNight === 30 && !person.noSleep ? (add ? 1 : -1) : 0;
          packageInfo[person.package].current31 += person.startNight === 31 && !person.noSleep || person.startNight === 30 && person.nights === 2 && !person.noSleep ? (add ? 1 : -1) : 0;
          if (packageInfo[person.package].current30 < 0 || packageInfo[person.package].current31 < 0) {
            reject();
            return;
          }
        }
        this.fireStore.doc(this.packageInfoOriginalRef).update(packageInfo).then(v => {
          resolve();
        }, reject);
      }, reject);
    });
  }

  cancelBooking(booking: any) {
    this.updatePackagePlaces(booking.persons, true).then(() => {
      this.fireStore.collection(this.authService.getUser().ref.path + '/bookings/').doc(booking.bookingId).delete().then(v => {
        this.notif.show('Reservierung gelöscht', NotificationType.Success);
      }, e => {
        this.notif.show('Reservierung konnte nicht gelöscht werden', NotificationType.Error);
        console.log('Error: ', e);
      });
    }, e => {
      this.notif.show('Reservierung konnte nicht gelöscht werden', NotificationType.Error);
      console.log('Error: ', e);
    });

  }

  paketChanged(person) {
    const fg = this.persons.get('person' + person);
    const paket = fg.get('package').value;
    if (!fg.get('noSleep').value && paket && (paket.current30 === 0 || paket.current31 === 0)) {
      fg.get('nights').patchValue(1);
      fg.get('nights').disable();
      if (paket.current30 === 0) {
        fg.get('startNight').patchValue(31);
        fg.get('startNight').disable();
      } else {
        fg.get('startNight').patchValue(30);
        fg.get('startNight').disable();
      }
    } else {
      if (fg.get('noSleep').value) {
        fg.get('package').patchValue({title: 'Gamma'});
      }
      fg.get('nights').enable();
      fg.get('startNight').enable();
    }
  }

  resetStepper() {
    this.currentBooking = null;
    this.persons = this._formBuilder.group({});
    this.currentPersons = [];
    this.overviewValue = [];
    this.overviewPrice = null;
    this.acceptAGB.controls.accept.setValue(null);
    this.getPlaces();
    this.stepper.reset();
  }

}

