import { Injectable } from '@angular/core';
import lozad from 'lozad';

@Injectable({
  providedIn: 'root',
})
export class ImageLazyLoaderService {
  constructor() {}

  init() {
    window.addEventListener('viewWillEnter', () => {
      const observer = lozad(); // lazy loads elements with default selector as '.lozad'
      observer.observe();
    });
  }
}
