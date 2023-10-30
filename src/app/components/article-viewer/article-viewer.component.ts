import { Component, OnInit, Input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { LoadingController } from '@ionic/angular';

@Component({
  selector: 'user-portal-article-viewer',
  templateUrl: './article-viewer.component.html',
  styleUrls: ['./article-viewer.component.scss'],
})
export class ArticleViewerComponent implements OnInit {
  @Input() customData: { siteUrl: string };
  siteUrl: any;
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
    this.siteUrl = this.domSanitizer.bypassSecurityTrustResourceUrl(
      this.customData.siteUrl
    );
  }

  async hideLoadingIndicator() {
    await this.loader.dismiss();
  }
}
