import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {PageNotFoundComponent} from '../pages/page-not-found/page-not-found.component';
import {DrinkWishesComponent} from '../pages/drink-wishes/drink-wishes.component';
import {GalleryComponent} from '../pages/gallery/gallery.component';
import {ContactComponent} from '../pages/contact/contact.component';
import {BookingComponent} from '../pages/booking/booking.component';
import {WelcomeComponent} from '../pages/welcome/welcome.component';
import {LoginDialogComponent} from './login-dialog/login-dialog.component';
import {HeaderComponent} from './header/header.component';
import {RouterModule} from '@angular/router';
import {MaterialImportModule} from '../import-modules/material-import.module';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {FormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SameValueDirective} from '../other/sameValueAsDirective';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialImportModule,
    FontAwesomeModule,
    FormsModule,
    FlexLayoutModule
  ],
  declarations: [
    PageNotFoundComponent,
    DrinkWishesComponent,
    GalleryComponent,
    ContactComponent,
    BookingComponent,
    WelcomeComponent,
    LoginDialogComponent,
    SameValueDirective,
    HeaderComponent,
  ],
  exports: [
      HeaderComponent
  ]
})
export class CoreModule { }
