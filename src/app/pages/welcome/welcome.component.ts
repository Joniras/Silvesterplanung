import {Component, OnInit} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public cite: Cite = null;

  constructor(private db: AngularFirestore) {
    this.db.collection('/cites').valueChanges().subscribe((v: Cite[]) => {
      const randomNumber = Math.floor(Math.random() * v.length);
      this.cite = v[randomNumber];
    });
  }

  ngOnInit() {
  }

}

interface Cite {
  text: string;
  author: string;
}
