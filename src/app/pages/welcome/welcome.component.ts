import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public cites: Cite[] = [];
  public index = null;

  constructor(private db: AngularFirestore) {
    this.db.collection('/cites').valueChanges().subscribe((v: Cite[]) => {
      this.index = Math.floor(Math.random() * v.length);
      this.cites = v;
    });
  }

  ngOnInit() {
  }

  refreshCite() {
    console.log("Old index", this.index);
    this.index = Math.floor(Math.random() * this.cites.length);
    console.log("New index", this.index);
  }
}

interface Cite {
  text: string;
  author: string;
}
