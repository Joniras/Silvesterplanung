import {NgModule} from '@angular/core';
import {MAT_DATE_LOCALE, MatButtonModule, MatCardModule, MatDialogModule, MatInputModule} from '@angular/material';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule
    ],
  declarations: [
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}
  ]
})
export class MaterialImportModule { }
