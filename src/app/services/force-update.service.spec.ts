import { TestBed } from '@angular/core/testing';

import { ForceUpdateService } from './force-update.service';

describe('ForceUpdateService', () => {
  let service: ForceUpdateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ForceUpdateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
