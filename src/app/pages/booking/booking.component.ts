import {Component, OnInit, ViewChild} from '@angular/core';
import {skipWhile, take} from 'rxjs/operators';
import {AngularFirestore} from '@angular/fire/firestore';
import {MatStep, MatStepper} from "@angular/material";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {AuthService} from "../../services/auth.service";

@Component({
  selector: 'app-booking',
  templateUrl: './booking.component.html',
  styleUrls: ['./booking.component.scss']
})
export class BookingComponent implements OnInit {
  public pakete: any[];

  public firstStepForm: FormGroup = null;
  public secondStepForm: FormGroup = null;
  @ViewChild("firstStep")
  public firstStep: MatStep = null;
  @ViewChild("secondStep")
  public secondStep: MatStep = null;
  @ViewChild("stepper")
  public stepper: MatStepper = null;

  public persons: any[] = [];
  public selectedPaket = null;

  constructor(private fireStore: AngularFirestore, private _formBuilder: FormBuilder, private authService: AuthService) {
    this.fireStore.collection('rest-places').valueChanges().pipe(take(1)).subscribe(v => {
      // console.log('Current Prices: ', v[0]);
      const data = [];
      for (let vElementKey in v[0]) {
        const elem: any = v[0][vElementKey];
        elem.title = vElementKey;
        data.push(elem);
      }
      data.sort((a, b) => (a.rank > b.rank) ? 1 : ((b.rank > a.rank) ? -1 : 0));
      this.pakete = data;
    });

    this.firstStepForm = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondStepForm = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });
    this.authService.getUserObservable().pipe(skipWhile(v => v==null)).subscribe(v=>{
      this.persons.push({name: this.authService.getUser().displayName});
    });
  }

  ngOnInit() {
  }

  setPaket(paket: any, type: string) {
    // console.log("paket :",paket);
    this.selectedPaket = {paket: paket, type: type};
    this.firstStepForm.controls.firstCtrl.setValue("--");
    this.stepper.next();
    this.firstStep.editable = true;
    this.firstStep.completed = true;
  }

  addUser() {
    this.persons.push({name: ""});
  }

  savePersons() {
    this.secondStepForm.controls.firstCtrl.setValue("--");
    this.stepper.next();
    this.secondStep.editable = true;
    this.secondStep.completed = true;
  }
}
