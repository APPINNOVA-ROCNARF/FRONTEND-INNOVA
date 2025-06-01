import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCoberturaClientesComponent } from './tabla-cobertura-clientes.component';

describe('TablaCoberturaClientesComponent', () => {
  let component: TablaCoberturaClientesComponent;
  let fixture: ComponentFixture<TablaCoberturaClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaCoberturaClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCoberturaClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
