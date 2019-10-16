import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {map, mergeMap, take} from 'rxjs/operators';
import {forkJoin,} from 'rxjs';

@Component({
  selector: 'app-booking-overview',
  templateUrl: './booking-overview.component.html',
  styleUrls: ['./booking-overview.component.scss']
})
export class BookingOverviewComponent implements OnInit {

  private bookings: any[];
  public dayChart: any;
  private pakete: any[] = [];
  public bookingPercentage: any[] = [];

  constructor(private fs: AngularFirestore) {
    this.getBookings().then((v: any) => {
      this.bookings = v;
      this.getDayChartData();
      this.getPakete().then(() => {
        this.getBookingPercentage();
      });
    }, e => {
      console.error(e);
    });
  }

  getBookings() {
    return new Promise<any>((resolve, reject) => {
      this.fs.collection('/users').snapshotChanges().pipe(take(1), mergeMap(persons => {
        const bookingPromises = [];
        for (let i = 0; i < persons.length; i++) {
          const person = persons[i];
          bookingPromises.push(this.fs.collection(person.payload.doc.ref.path + '/bookings').valueChanges().pipe(take(1)));
        }
        return forkJoin(bookingPromises).pipe(map(bookings2 => {
          const Allbookings = [];
          for (let i = 0; i < persons.length; i++) {
            const bookings: any = bookings2[i];
            const person = persons[i];
            for (let j = 0; j < bookings.length; j++) {
              const booking = bookings[j];
              for (let k = 0; k < booking.persons.length; k++) {
                const bookingElement = booking.persons[k];
                bookingElement.booker = person.payload.doc.data();
                bookingElement.booker.path = person.payload.doc.ref.path;
                bookingElement.dueDate = booking.dueDate.toDate();
                Allbookings.push(bookingElement);
              }
            }
          }
          return Allbookings;
        }));
      })).subscribe(resolve, reject);
    });
  }

  getPakete() {
    return new Promise((resolve, reject) => {
      this.fs.collection('rest-places').snapshotChanges().pipe(take(1)).subscribe(v => {
        // console.log('Current Prices: ', v[0]);
        const data = [];
        for (let vElementKey in v[0].payload.doc.data()) {
          const elem: any = v[0].payload.doc.data()[vElementKey];
          elem.title = vElementKey;
          data.push(elem);
        }
        data.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0));
        this.pakete = data;
        resolve(this.pakete);
      }, reject);
    });

  }


  getDayChartData() {
    const data = [{
      label: '# der Gäste',
      data: [0, 0]
    }];
    for (let i = 0; i < this.bookings.length; i++) {
      const booking = this.bookings[i];
      if (booking.nights === 2) {
        data[0].data[0] += 1;
        data[0].data[1] += 1;
      } else if (booking.startNight === 30) {
        data[0].data[0] += 1;
      } else {
        data[0].data[1] += 1;
      }
    }
    this.dayChart = {
      data: data,
      labels: ['30. Dezember', '31. Dezember'],
      options: {
        maintainAspectRatio: false
      }
    };
  }

  ngOnInit() {
  }

  private getBookingPercentage() {
    const pieData = [];
    for (let i = 0; i < this.pakete.length; i++) {
      const paketeElement = this.pakete[i];
      const paketData = {
        data: {
          day1: [paketeElement.current30, paketeElement.total30 - paketeElement.current30],
          day2: [paketeElement.current31, paketeElement.total31 - +paketeElement.current31]
        },
        labels: ['frei', 'gebucht'],
        options: {
          maintainAspectRatio: false,
          responsive: true,
          title: {
            display: true,
            text: paketeElement.title
          }
        }
      };
      pieData.push(paketData);
    }
    // console.log("All: ",pieData);
    this.bookingPercentage = pieData;
  }
}
