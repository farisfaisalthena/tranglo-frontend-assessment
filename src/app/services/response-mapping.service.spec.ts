import { TestBed } from '@angular/core/testing';

import { ResponseMappingService } from './response-mapping.service';

describe('ResponseMappingService', () => {
  let service: ResponseMappingService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ResponseMappingService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
