import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresupuestoViaticosComponent } from './presupuesto-viaticos.component';

describe('PresupuestoViaticosComponent', () => {
  let component: PresupuestoViaticosComponent;
  let fixture: ComponentFixture<PresupuestoViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresupuestoViaticosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresupuestoViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
