import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-prices',
  templateUrl: './prices.component.html',
  styleUrls: ['./prices.component.scss']
})
export class PricesComponent implements OnInit {
  public dataSource = [TableData2018, TableData2017];
  public selectedYear = 0;
  public displayedColumns: string[] = ['title', 'desc', 'price1', 'price2', 'priceWoAlcohol1', 'priceWoAlcohol2'];
  constructor() { }

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
    priceWoAlcohol2: 14},
  {
    title: 'Proletarier',
    desc: 'Halbes Doppelbett im Haupthaus',
    price1: 27,
    price2: 49,
    priceWoAlcohol1: 13,
    priceWoAlcohol2: 20},
  {
    title: 'Bourgeoisie',
    desc: 'Ein Einzelbett im Haupthaus',
    price1: 29,
    price2: 54,
    priceWoAlcohol1: 15,
    priceWoAlcohol2: 25},
  {
    title: 'Bourgeoisie-Paar',
    desc: 'Ein Doppelbett im eigenen Zimmer im Haupthaus (für 2 Personen)',
    price1: 65,
    price2: 120,
    priceWoAlcohol1: 46,
    priceWoAlcohol2: 85},
];

const TableData2017 = [
  {
    title: 'Penner',
    desc: 'Matratze im Hostel',
    price1: 20,
    price2: 38,
    priceWoAlcohol1: 8,
    priceWoAlcohol2: 14},
  {
    title: 'Mensch',
    desc: 'Halbes Doppelbett im Haupthaus',
    price1: 23,
    price2: 40,
    priceWoAlcohol1: 11,
    priceWoAlcohol2: 16},
  {
    title: 'Privilegierter Mensch',
    desc: 'Ein Einzelbett im Haupthaus',
    price1: 25,
    price2: 45,
    priceWoAlcohol1: 13,
    priceWoAlcohol2: 21},
  {
    title: 'Privilegierter Straight white cis male',
    desc: 'Ein Doppelbett im eigenen Zimmer im Haupthaus (für 2 Personen)',
    price1: 56,
    price2: 100,
    priceWoAlcohol1: 32,
    priceWoAlcohol2: 52},
];
