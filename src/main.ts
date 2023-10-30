import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

const bootstrap = () => platformBrowserDynamic().bootstrapModule(AppModule);
if (environment.env === 'live' && environment.debug === false) {
  enableProdMode();
}
bootstrap().catch((err) => console.log(err));
