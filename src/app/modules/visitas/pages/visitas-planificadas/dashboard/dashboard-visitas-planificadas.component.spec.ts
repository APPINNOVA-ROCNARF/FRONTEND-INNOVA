import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardVisitasPlanificadasComponent } from './dashboard-visitas-planificadas.component';

describe('DashboardVisitasPlanificadasComponent', () => {
  let component: DashboardVisitasPlanificadasComponent;
  let fixture: ComponentFixture<DashboardVisitasPlanificadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardVisitasPlanificadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardVisitasPlanificadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
