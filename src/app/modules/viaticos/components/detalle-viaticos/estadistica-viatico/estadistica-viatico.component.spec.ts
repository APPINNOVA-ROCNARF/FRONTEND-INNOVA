import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadisticaViaticoComponent } from './estadistica-viatico.component';

describe('EstadisticaViaticoComponent', () => {
  let component: EstadisticaViaticoComponent;
  let fixture: ComponentFixture<EstadisticaViaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadisticaViaticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadisticaViaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
