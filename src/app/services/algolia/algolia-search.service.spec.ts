import { TestBed } from '@angular/core/testing';

import { AlgoliaSearchService } from './algolia-search.service';

describe('AlgoliaSearchService', () => {
  let service: AlgoliaSearchService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlgoliaSearchService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
