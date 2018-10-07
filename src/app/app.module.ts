import {BrowserModule} from '@angular/platform-browser';
import {LOCALE_ID, NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {AngularFirestoreModule} from '@angular/fire/firestore';
import {AngularFireAuthModule} from '@angular/fire/auth';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {AppRoutingModule} from './app-routing.module';
import {FlexLayoutModule} from '@angular/flex-layout';
import {SimpleNotificationsModule} from 'angular2-notifications';
import {AuthService} from './services/auth.service';
import {NotificationService} from './services/notification.service';
import {LoginDialogComponent} from './core/login-dialog/login-dialog.component';
import {CoreModule} from './core/core.module';
import './other/fontAwesomeIncludes';
import {MaterialImportModule} from './import-modules/material-import.module';
import {AngularFireDatabaseModule} from '@angular/fire/database';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {ServiceWorkerModule} from '@angular/service-worker';
import localeDE from '@angular/common/locales/de-AT';
import {registerLocaleData} from '@angular/common';
import {AdminGuard} from './other/AdminGuard';
import {MessagingService} from './services/messaging.service';

// the second parameter 'fr' is optional
registerLocaleData(localeDE);

@NgModule({
  declarations: [
    AppComponent,
  ],
  imports: [
    BrowserModule,
    CoreModule,
    BrowserAnimationsModule,
    AppRoutingModule,
    MaterialImportModule,
    FontAwesomeModule,
    FlexLayoutModule,
    SimpleNotificationsModule.forRoot(),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFirestoreModule, // imports firebase/firestore, only needed for database features
    AngularFireAuthModule, // imports firebase/auth, only needed for auth features,
    AngularFireDatabaseModule, ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production })
  ],
  providers: [AdminGuard, AuthService, MessagingService, NotificationService,{
    provide: LOCALE_ID,
    useValue: 'de-AT'
  }],
  bootstrap: [AppComponent],
  entryComponents: [LoginDialogComponent]
})
export class AppModule {
}
