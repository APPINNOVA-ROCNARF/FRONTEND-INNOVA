import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaSolicitudViaticoComponent } from './estadistica-solicitud-viatico.component';

describe('EstadisticaSolicitudViaticoComponent', () => {
  let component: EstadisticaSolicitudViaticoComponent;
  let fixture: ComponentFixture<EstadisticaSolicitudViaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticaSolicitudViaticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticaSolicitudViaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
