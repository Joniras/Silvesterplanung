import {NgModule} from '@angular/core';
import {
  MAT_DATE_LOCALE,
  MatButtonModule, MatButtonToggleModule,
  MatCardModule,
  MatDialogModule,
  MatInputModule, MatListModule,
  MatSlideToggleModule,
  MatTabsModule
} from '@angular/material';
import {CommonModule} from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    MatInputModule,
    MatCardModule,
    MatDialogModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatListModule,
    MatButtonToggleModule

  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatListModule,
    MatButtonToggleModule
    ],
  declarations: [
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}
  ]
})
export class MaterialImportModule { }
