import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaVisitasPlanificadasComponent } from './tabla-visitas-planificadas.component';

describe('TablaVisitasPlanificadasComponent', () => {
  let component: TablaVisitasPlanificadasComponent;
  let fixture: ComponentFixture<TablaVisitasPlanificadasComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaVisitasPlanificadasComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaVisitasPlanificadasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
