import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DashboardCoberturaClientesComponent } from './dashboard-cobertura-clientes.component';

describe('DashboardCoberturaClientesComponent', () => {
  let component: DashboardCoberturaClientesComponent;
  let fixture: ComponentFixture<DashboardCoberturaClientesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DashboardCoberturaClientesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DashboardCoberturaClientesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
