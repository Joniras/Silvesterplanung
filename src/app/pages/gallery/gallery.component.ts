import {Component, OnInit} from '@angular/core';
import {GALLERY_CONF, GALLERY_IMAGE} from 'ngx-image-gallery';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {

  public conf: GALLERY_CONF = {
    imageOffset: '0px',
    showDeleteControl: false,
    showImageTitle: false,
    inline: true,
    showCloseControl: false,
    backdropColor: "transparent"
  };

  public images: GALLERY_IMAGE[] = [
    {
      url: '/assets/img/gallery/preview_xs/0021.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0021.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0024.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0024.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0036.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0036.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0045.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0045.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0049.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0049.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0050.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0050.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0063.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0063.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0065.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0065.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0074.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0074.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0079.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0079.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0082.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0082.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0087.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0087.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0092.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0092.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0093.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0093.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0099.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0099.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0103.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0103.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0112.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0112.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0122.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0122.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0167.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0167.jpg'
    }, {
      url: '/assets/img/gallery/preview_xs/0179.jpg',
      thumbnailUrl: '/assets/img/gallery/preview_xxs/0179.jpg'
    },
  ];

  constructor() {
  }

  ngOnInit() {
  }

}
