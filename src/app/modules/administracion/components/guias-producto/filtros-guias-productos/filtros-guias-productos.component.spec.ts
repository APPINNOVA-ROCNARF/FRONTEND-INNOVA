import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FiltrosGuiasProductosComponent } from './filtros-guias-productos.component';

describe('FiltrosGuiasProductosComponent', () => {
  let component: FiltrosGuiasProductosComponent;
  let fixture: ComponentFixture<FiltrosGuiasProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FiltrosGuiasProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FiltrosGuiasProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
