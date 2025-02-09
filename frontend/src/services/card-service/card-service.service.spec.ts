import { TestBed } from '@angular/core/testing';

import { PaymentCardService } from './card-service.service';

describe('PaymentCardService', () => {
  let service: PaymentCardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PaymentCardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
