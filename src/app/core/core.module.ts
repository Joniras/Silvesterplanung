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
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SameValueDirective} from '../other/sameValueAsDirective';
import {PricesComponent} from '../pages/prices/prices.component';
import {FeatureInProgressComponent} from './feature-in-progress/feature-in-progress.component';
import {TooltipModule} from 'ngx-tooltip';
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {AdminViewComponent} from '../pages/admin-view/admin-view.component';
import {NgxImageGalleryModule} from 'ngx-image-gallery';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialImportModule,
    FontAwesomeModule,
    FormsModule,
    FlexLayoutModule,
    TooltipModule,
    NgbModule,
    NgxImageGalleryModule,
    ReactiveFormsModule
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
    PricesComponent,
    FeatureInProgressComponent,
    AdminViewComponent,
  ],
  exports: [
      HeaderComponent
  ]
})
export class CoreModule { }
