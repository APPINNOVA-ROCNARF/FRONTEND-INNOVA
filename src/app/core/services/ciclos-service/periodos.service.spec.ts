import { TestBed } from '@angular/core/testing';

import { PeriodosService } from './ciclos.service';

describe('PeriodosService', () => {
  let service: PeriodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PeriodosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
