import { TestBed } from '@angular/core/testing';

import { UserSessionService } from './session.service';

describe('SessionService', () => {
  let service: UserSessionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserSessionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
