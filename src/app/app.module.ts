import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ErrorHandler, NgModule } from '@angular/core';
import { AngularFireModule } from '@angular/fire';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFireStorageModule } from '@angular/fire/storage';
import { CoreModule, FlexLayoutModule } from '@angular/flex-layout';
import { BrowserModule } from '@angular/platform-browser';
import { YouTubePlayerModule } from '@angular/youtube-player';
import { AppVersion } from '@ionic-native/app-version/ngx';
import { Facebook } from '@ionic-native/facebook/ngx';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { PhotoViewer } from '@ionic-native/photo-viewer/ngx';
import { SignInWithApple } from '@ionic-native/sign-in-with-apple/ngx';
import { Smartlook } from '@ionic-native/smartlook/ngx';
import { SocialSharing } from '@ionic-native/social-sharing/ngx';
import { IonicModule } from '@ionic/angular';
import 'firebase/app';
import 'firebase/database';
import { environment } from '../environments/environment';
import { AppRoutingModule } from './app-routing.module';
import { StarterPageComponent } from './app.component';
import { httpInterceptorProviders } from './http-interceptors';
import { MaterialModule } from './modules/material.module';
import { SharedModule } from './modules/shared.module';
import { AppErrorHandlerService } from './services/app-error-handler.service';
import { AppInitializerService } from './services/app-initializer.service';

@NgModule({
  declarations: [StarterPageComponent],
  imports: [
    CommonModule,
    // Angular & Ionic Imports
    BrowserModule,
    HttpClientModule,
    IonicModule.forRoot(),
    // External Libraries and Utilities
    FlexLayoutModule,
    MaterialModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFireStorageModule,
    AngularFireAuthModule,
    YouTubePlayerModule,
    // App Internal Imports
    AppRoutingModule,
    CoreModule,
    SharedModule.forRoot(),
  ],
  providers: [
    // IONIC
    AppVersion,
    Facebook,
    GooglePlus,
    SignInWithApple,
    AngularFireDatabase,
    SocialSharing,
    httpInterceptorProviders,
    Smartlook,
    PhotoViewer,
    { provide: ErrorHandler, useClass: AppErrorHandlerService },
  ],
  bootstrap: [StarterPageComponent],
})
export class AppModule {
  constructor(private appInitializerService: AppInitializerService) {
    this.appInitializerService.init();
  }
}
