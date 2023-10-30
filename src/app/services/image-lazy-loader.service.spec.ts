import { TestBed } from '@angular/core/testing';

import { ImageLazyLoaderService } from './image-lazy-loader.service';

describe('ImageLazyLoaderService', () => {
  let service: ImageLazyLoaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ImageLazyLoaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
