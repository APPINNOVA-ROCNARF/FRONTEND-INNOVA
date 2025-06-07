import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosCoberturaMedicosComponent } from './filtros-cobertura-medicos.component';

describe('FiltrosCoberturaMedicosComponent', () => {
  let component: FiltrosCoberturaMedicosComponent;
  let fixture: ComponentFixture<FiltrosCoberturaMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosCoberturaMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosCoberturaMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
