import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosCoberturaClientesComponent } from './filtros-cobertura-clientes.component';

describe('FiltrosCoberturaClientesComponent', () => {
  let component: FiltrosCoberturaClientesComponent;
  let fixture: ComponentFixture<FiltrosCoberturaClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosCoberturaClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosCoberturaClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
