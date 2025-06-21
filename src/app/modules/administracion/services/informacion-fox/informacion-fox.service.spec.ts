import { TestBed } from '@angular/core/testing';

import { InformacionFoxService } from './informacion-fox.service';

describe('InformacionFoxService', () => {
  let service: InformacionFoxService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformacionFoxService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
