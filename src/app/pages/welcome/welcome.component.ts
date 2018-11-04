import {Component, OnInit, ViewChild} from '@angular/core';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatTabGroup} from '@angular/material';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent implements OnInit {
  public cites: Cite[] = [];
  public index = null;
  @ViewChild("tabGroup")
  public tabGroup: MatTabGroup;

  constructor(private db: AngularFirestore) {
    this.db.collection('/cites').valueChanges().subscribe((v: Cite[]) => {
      this.index = Math.floor(Math.random() * v.length);
      this.cites = v;
    });
  }

  ngOnInit() {
  }

  refreshCite() {
    let newIndex = null;
    do {
      newIndex = Math.floor(Math.random() * this.cites.length);
    } while (this.index === newIndex);
    this.index = newIndex;
  }

  moreInfos(){
    this.tabGroup.selectedIndex = 1;
  }
}

interface Cite {
  text: string;
  author: string;
}
