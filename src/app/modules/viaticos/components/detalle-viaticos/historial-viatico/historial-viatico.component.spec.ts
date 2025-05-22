import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistorialViaticoComponent } from './historial-viatico.component';

describe('HistorialViaticoComponent', () => {
  let component: HistorialViaticoComponent;
  let fixture: ComponentFixture<HistorialViaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistorialViaticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistorialViaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
