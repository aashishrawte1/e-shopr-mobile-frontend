import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';

import { YOUTUBE_VIDEO_ID_MATCHER_REGEX } from '../../constants';
@Component({
  selector: 'user-portal-full-screen-image-viewer',
  templateUrl: './full-screen-image-viewer.component.html',
  styleUrls: ['./full-screen-image-viewer.component.scss'],
})
export class FullScreenImageViewerComponent implements OnInit {
  @Input() customData: { imageUrl: string };
  imageUrl: any;
  response: string;
  loader: HTMLIonLoadingElement;
  constructor(
    private domSanitizer: DomSanitizer,
    private loadingController: LoadingController
  ) {}

  async ngOnInit() {
    this.loader = await this.loadingController.create({
      message: 'Loading content...',
    });
    await this.loader.present();
    this.imageUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.customData.imageUrl
    );
  }

  async hideLoadingIndicator() {
    await this.loader.dismiss();
  }
}
