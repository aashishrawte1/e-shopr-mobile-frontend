import { TestBed } from '@angular/core/testing';

import { ProductFetcherService } from './product-fetcher.service';

describe('ProductService', () => {
  let service: ProductFetcherService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductFetcherService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
