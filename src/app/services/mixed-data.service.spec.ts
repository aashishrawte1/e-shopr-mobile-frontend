import { TestBed } from '@angular/core/testing';

import { MixedDataGetterService } from './mixed-data.service';

describe('MixedDataService', () => {
  let service: MixedDataGetterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MixedDataGetterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
