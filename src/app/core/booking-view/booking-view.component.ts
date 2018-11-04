import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';

@Component({
  selector: 'app-booking-view',
  templateUrl: './booking-view.component.html',
  styleUrls: ['./booking-view.component.scss']
})
export class BookingViewComponent implements OnInit {

  public currentDate = new Date();

  @Input("booking")
  public booking = null;

  @Input("adminView")
  public adminView = false;

  @Output("cancelBooking")
  public cancelBooking = new EventEmitter();

  @Output("acceptBooking")
  public acceptBooking = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  cancel() {
    this.cancelBooking.emit();
  }

  accept() {
    this.acceptBooking.emit();
  }
}
