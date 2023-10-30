import { Injectable } from '@angular/core';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IProductResult } from '../models';
import { AppShareService } from './app-share.service';
import { StoreService } from './store.service';
@Injectable({
  providedIn: 'root',
})
export class ProductShareService {
  constructor(
    private socialSharing: SocialSharing,
    private appShareService: AppShareService,
    private storeService: StoreService
  ) {}

  async init() {}

  async shareProduct({ product }: { product: IProductResult }) {
    const appDownloadLink = await this.appShareService.getAppShareLink();
    const shareMessageText = this.storeService.json.pageConfig.value
      .componentData.productDetailPage.productShareSection.shareMessageText;
    await this.socialSharing
      .shareWithOptions({
        message: shareMessageText.replace(/{{productTitle}}/g, product.title),
        subject: 'thought you might like it',
        files: [product.media[0].link],
        url: appDownloadLink,
        chooserTitle: 'Share via',
      })
      .catch((error) => {
        console.log(
          `Error occurred during sharing product with id: `,
          product.uniqueId,
          { error }
        );
        return false;
      })
      .then(() => {
        return true;
      });
  }
}
