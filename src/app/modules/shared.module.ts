import { CommonModule } from '@angular/common';
import {
  CUSTOM_ELEMENTS_SCHEMA,
  ModuleWithProviders,
  NgModule,
} from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { ActiveDowntimeComponent } from '../components/active-downtime/active-downtime.component';
import { AddCommentComponent } from '../components/add-comment/add-comment.component';
import { ArticleTileComponent } from '../components/article-tile/article-tile.component';
import { ArticleViewerComponent } from '../components/article-viewer/article-viewer.component';
import { CartItemsSummaryComponent } from '../components/cart-items-summary/cart-items-summary.component';
import { CircularProgressBarModule } from '../components/circular-progress-bar/circular-progress-bar.module';
import { CodePushBundleDownloaderComponent } from '../components/code-push-bundle-downloader/code-push-bundle-downloader.component';
import { CustomModalComponent } from '../components/custom-modal/custom-modal.component';
import { CustomPopupComponent } from '../components/custom-popup/custom-popup.component';
import { CustomProgressBarComponent } from '../components/custom-progress-bar/custom-progress-bar.component';
import { FullScreenImageViewerComponent } from '../components/full-screen-image-viewer/full-screen-image-viewer.component';
import { MerchantTileComponent } from '../components/merchant-tile/merchant-tile.component';
import { ProductTileComponent } from '../components/product-tile/product-tile.component';
import { SortComponentModule } from '../components/sort/sort.module';
import { TileSkeletonComponent } from '../components/tile-skeleton/tile-skeleton.component';
import { VideoViewerComponent } from '../components/video-viewer/video-viewer.component';
import { DynamicComponentHostDirective } from '../directives/dynamic-component-host.directive';
import { UserInfoInputComponent } from '../components/user-info-input/user-info-input.component';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [
    AddCommentComponent,
    TileSkeletonComponent,
    CodePushBundleDownloaderComponent,
    CustomPopupComponent,
    CustomModalComponent,
    CartItemsSummaryComponent,
    DynamicComponentHostDirective,
    ActiveDowntimeComponent,
    ProductTileComponent,
    MerchantTileComponent,
    ArticleTileComponent,
    ArticleViewerComponent,
    FullScreenImageViewerComponent,
    VideoViewerComponent,
    CustomProgressBarComponent,
    UserInfoInputComponent,
  ],
  imports: [
    CommonModule,
    CircularProgressBarModule,
    FlexLayoutModule,
    YouTubePlayerModule,
    SortComponentModule,
    ReactiveFormsModule,
  ],
  exports: [
    CircularProgressBarModule,
    FlexLayoutModule,
    YouTubePlayerModule,
    AddCommentComponent,
    TileSkeletonComponent,
    CodePushBundleDownloaderComponent,
    CustomPopupComponent,
    CustomModalComponent,
    CartItemsSummaryComponent,
    DynamicComponentHostDirective,
    ActiveDowntimeComponent,
    ProductTileComponent,
    MerchantTileComponent,
    ArticleTileComponent,
    ArticleViewerComponent,
    FullScreenImageViewerComponent,
    VideoViewerComponent,
    CustomProgressBarComponent,
    SortComponentModule,
    UserInfoInputComponent,
  ],
  entryComponents: [
    CodePushBundleDownloaderComponent,
    CustomPopupComponent,
    CustomModalComponent,
    ArticleViewerComponent,
    FullScreenImageViewerComponent,
    VideoViewerComponent,
  ],
  schemas: [
    CUSTOM_ELEMENTS_SCHEMA, // Tells Angular we will have custom tags in our templates
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
