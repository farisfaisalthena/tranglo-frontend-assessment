import { TestBed } from '@angular/core/testing';

import { ApiCachingService } from './api-caching.service';

describe('ApiCachingService', () => {
  let service: ApiCachingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiCachingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
