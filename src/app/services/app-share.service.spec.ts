import { TestBed } from '@angular/core/testing';

import { AppShareService } from './app-share.service';

describe('AppShareService', () => {
  let service: AppShareService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AppShareService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
