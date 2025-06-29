import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaVisitasAgregadoComponent } from './tabla-visitas-agregado.component';

describe('TablaVisitasAgregadoComponent', () => {
  let component: TablaVisitasAgregadoComponent;
  let fixture: ComponentFixture<TablaVisitasAgregadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaVisitasAgregadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaVisitasAgregadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
