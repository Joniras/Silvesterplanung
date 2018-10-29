import {Component, OnInit} from '@angular/core';
import {take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  public pakete: any[];

  constructor(private fireStore: AngularFirestore) {
    this.fireStore.collection('rest-places').valueChanges().pipe(take(1)).subscribe(v => {
      console.log('Current Prices: ', v[0]);
      const data = [];
      for (let vElementKey in v[0]) {
        const elem: any = v[0][vElementKey];
        elem.title = vElementKey;
        data.push(elem);
      }
      data.sort((a,b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0));
      console.log("asdf",data);
      this.pakete = data;
    });
  }

  ngOnInit() {
  }

}
