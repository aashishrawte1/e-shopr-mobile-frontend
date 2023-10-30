import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ZohoService {
  init() {
    if (environment.env === 'live') {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.src = '/assets/scripts/zoho.script.js';
      document.getElementsByTagName('body')[0].appendChild(script);
    }
  }
}
