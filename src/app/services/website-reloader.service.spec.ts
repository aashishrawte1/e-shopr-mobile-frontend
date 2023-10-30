import { TestBed } from '@angular/core/testing';

import { WebsiteReloaderService } from './website-reloader.service';

describe('WebsiteReloaderService', () => {
  let service: WebsiteReloaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WebsiteReloaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
