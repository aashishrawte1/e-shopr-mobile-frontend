import { TestBed } from '@angular/core/testing';

import { CustomCustomGoogleTagManagerService } from './custom-google-tag-manager.service';

describe('CustomCustomGoogleTagManagerService', () => {
  let service: CustomCustomGoogleTagManagerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomCustomGoogleTagManagerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
