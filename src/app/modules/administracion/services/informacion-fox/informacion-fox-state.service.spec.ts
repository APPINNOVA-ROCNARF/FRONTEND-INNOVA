import { TestBed } from '@angular/core/testing';

import { InformacionFoxStateService } from './informacion-fox-state.service';

describe('InformacionFoxStateService', () => {
  let service: InformacionFoxStateService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformacionFoxStateService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
