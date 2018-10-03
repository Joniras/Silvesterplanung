import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {AngularFireStorageModule} from '@angular/fire/storage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';
import {AppRoutingModule} from './app-routing.module';
import {LoginComponent} from './pages/login/login.component';
import {RegisterComponent} from './pages/register/register.component';
import {DrinkWishesComponent} from './pages/drink-wishes/drink-wishes.component';
import {MaterialImportModule} from './import-modules/material-import.module';
import {ContactComponent} from './pages/contact/contact.component';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {GalleryComponent} from './pages/gallery/gallery.component';
import {BookingComponent} from './pages/booking/booking.component';
import {FlexLayoutModule} from '@angular/flex-layout';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {RouterModule} from '@angular/router';
import {LoginDialogComponent} from './pages/login/login-dialog/login-dialog.component';
import {FormsModule} from '@angular/forms';
import {library} from '@fortawesome/fontawesome-svg-core';
import {faSync} from '@fortawesome/free-solid-svg-icons/faSync';
import {faGooglePlusG} from '@fortawesome/free-brands-svg-icons/faGooglePlusG';
import {faFacebookF} from '@fortawesome/free-brands-svg-icons/faFacebookF';
import { SimpleNotificationsModule} from 'angular2-notifications';
import {AuthService} from './services/auth.service';
import {NotificationService} from './services/notification.service';
import {SameValueDirective} from "./services/sameValueAsDirective";
import { HeaderComponent } from './header/header.component';
import {faHeart, faPlus} from "@fortawesome/free-solid-svg-icons";

@NgModule({
  declarations: [
    AppComponent,
    PageNotFoundComponent,
    LoginComponent,
    RegisterComponent,
    DrinkWishesComponent,
    GalleryComponent,
    ContactComponent,
    BookingComponent,
    WelcomeComponent,
    LoginDialogComponent,
    SameValueDirective,
    HeaderComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialImportModule,
    FlexLayoutModule,
    FontAwesomeModule,
    RouterModule,
    FormsModule,
    SimpleNotificationsModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireStorageModule // imports firebase/storage only needed for storage features
  ],
  providers: [AuthService, NotificationService],
  bootstrap: [AppComponent],
  entryComponents: [LoginDialogComponent]
})
export class AppModule {
}

library.add(
  faSync, faFacebookF, faGooglePlusG, faPlus, faHeart);
