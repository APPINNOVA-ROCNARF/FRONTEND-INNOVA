import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaTablaBonificacionesComponent } from './carga-tabla-bonificaciones.component';

describe('CargaTablaBonificacionesComponent', () => {
  let component: CargaTablaBonificacionesComponent;
  let fixture: ComponentFixture<CargaTablaBonificacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaTablaBonificacionesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaTablaBonificacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
