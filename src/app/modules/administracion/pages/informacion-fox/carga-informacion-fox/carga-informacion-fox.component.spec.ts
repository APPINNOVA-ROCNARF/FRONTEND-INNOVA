import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaInformacionFoxComponent } from './carga-informacion-fox.component';

describe('CargaInformacionFoxComponent', () => {
  let component: CargaInformacionFoxComponent;
  let fixture: ComponentFixture<CargaInformacionFoxComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaInformacionFoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaInformacionFoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
