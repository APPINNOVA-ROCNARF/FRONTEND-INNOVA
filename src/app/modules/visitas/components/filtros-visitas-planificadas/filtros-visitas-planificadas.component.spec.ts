import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosVisitasPlanificadasComponent } from './filtros-visitas-planificadas.component';

describe('FiltrosVisitasPlanificadasComponent', () => {
  let component: FiltrosVisitasPlanificadasComponent;
  let fixture: ComponentFixture<FiltrosVisitasPlanificadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosVisitasPlanificadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosVisitasPlanificadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
