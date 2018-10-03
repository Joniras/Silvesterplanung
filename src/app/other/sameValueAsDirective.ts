import {Directive, Input} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, Validator} from '@angular/forms';

@Directive({
  selector: '[app_hastobe]',
  providers: [{provide: NG_VALIDATORS, useExisting: SameValueDirective, multi: true}]
})
export class SameValueDirective implements Validator {
  @Input() app_hastobe: string;

  constructor() {
  }

  validate(control: AbstractControl): { [key: string]: any } {
    return !(control.value === this.app_hastobe) && control.value && this.app_hastobe ? {"notsame": true} : null;
  }
}
