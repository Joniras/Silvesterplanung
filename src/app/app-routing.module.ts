import {NoPreloading, RouterModule, Routes} from '@angular/router';
import {NgModule} from '@angular/core';
import {WelcomeComponent} from './pages/welcome/welcome.component';
import {DrinkWishesComponent} from './pages/drink-wishes/drink-wishes.component';
import {BookingComponent} from './pages/booking/booking.component';
import {GalleryComponent} from './pages/gallery/gallery.component';
import {ContactComponent} from './pages/contact/contact.component';
import {PageNotFoundComponent} from './pages/page-not-found/page-not-found.component';

export const appRoutes: Routes = [
  {path: '', children: [
      {path: '', component: WelcomeComponent},
      {path: 'wishes', component: DrinkWishesComponent},
      {path: 'book', component: BookingComponent},
      {path: 'gallery', component: GalleryComponent},
      {path: 'contact', component: ContactComponent},
    ]},
  {path: "**", component: PageNotFoundComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(appRoutes, {preloadingStrategy: NoPreloading})
  ],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
