import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {take} from 'rxjs/operators';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {
  public data2017 = TableData2017;
  public data2018 = TableData2018;
  public currentData = [];
  public displayedColumns: string[] = ['title', 'desc', 'price1', 'price2', 'priceWoAlcohol1', 'priceWoAlcohol2', 'current30', 'current31'];
  public displayedColumnsPast: string[] = ['title', 'desc', 'price1', 'price2', 'priceWoAlcohol1', 'priceWoAlcohol2'];

  constructor(private fireStore: AngularFirestore) {
    this.fireStore.collection('rest-places').valueChanges().pipe(take(1)).subscribe(v => {
      console.log('Current Prices: ', v[0]);
      const data = [];
      for (let vElementKey in v[0]) {
        const elem: any = v[0][vElementKey];
        elem.title = vElementKey;
        data.push(elem);
      }
      data.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0));
      this.currentData = data;
    });
  }

  ngOnInit() {
  }

}

const TableData2018 = [
  {
    title: 'Hobo',
    desc: 'Matratze im Hostel',
    price1: 24,
    price2: 44,
    priceWoAlcohol1: 8,
    priceWoAlcohol2: 14
  },
  {
    title: 'Proletarier',
    desc: 'Halbes Doppelbett im Haupthaus',
    price1: 27,
    price2: 49,
    priceWoAlcohol1: 13,
    priceWoAlcohol2: 20
  },
  {
    title: 'Bourgeoisie',
    desc: 'Ein Einzelbett im Haupthaus',
    price1: 29,
    price2: 54,
    priceWoAlcohol1: 15,
    priceWoAlcohol2: 25
  },
  {
    title: 'Bourgeoisie-Paar',
    desc: 'Ein Doppelbett im eigenen Zimmer im Haupthaus (für 2 Personen)',
    price1: 65,
    price2: 120,
    priceWoAlcohol1: 46,
    priceWoAlcohol2: 85
  },
];

const TableData2017 = [
  {
    title: 'Penner',
    desc: 'Matratze im Hostel',
    price1: 20,
    price2: 38,
    priceWoAlcohol1: 8,
    priceWoAlcohol2: 14
  },
  {
    title: 'Mensch',
    desc: 'Halbes Doppelbett im Haupthaus',
    price1: 23,
    price2: 40,
    priceWoAlcohol1: 11,
    priceWoAlcohol2: 16
  },
  {
    title: 'Privilegierter Mensch',
    desc: 'Ein Einzelbett im Haupthaus',
    price1: 25,
    price2: 45,
    priceWoAlcohol1: 13,
    priceWoAlcohol2: 21
  },
  {
    title: 'Privilegierter Straight white cis male',
    desc: 'Ein Doppelbett im eigenen Zimmer im Haupthaus (für 2 Personen)',
    price1: 56,
    price2: 100,
    priceWoAlcohol1: 32,
    priceWoAlcohol2: 52
  },
];
