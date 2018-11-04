import {NgModule} from '@angular/core';
import {
  MAT_DATE_LOCALE,
  MatButtonModule,
  MatButtonToggleModule,
  MatCardModule,
  MatCheckboxModule,
  MatDialogModule,
  MatInputModule,
  MatListModule,
  MatMenuModule,
  MatProgressSpinnerModule,
  MatSelectModule,
  MatSidenavModule,
  MatSlideToggleModule,
  MatStepperModule,
  MatTableModule,
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
    MatButtonToggleModule,
    MatSidenavModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatStepperModule,
    MatCheckboxModule
  ],
  exports: [
    MatInputModule,
    MatCardModule,
    MatButtonModule,
    MatDialogModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatListModule,
    MatButtonToggleModule,
    MatSidenavModule,
    MatCardModule,
    MatProgressSpinnerModule,
    MatTableModule,
    MatSelectModule,
    MatMenuModule,
    MatStepperModule,
    MatCheckboxModule
    ],
  declarations: [
  ],
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'de-DE'}
  ]
})
export class MaterialImportModule { }
