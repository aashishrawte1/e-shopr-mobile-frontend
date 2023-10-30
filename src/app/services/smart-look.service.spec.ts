import { TestBed } from '@angular/core/testing';

import { SmartLookService } from './smart-look.service';

describe('SmartLookService', () => {
  let service: SmartLookService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SmartLookService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
