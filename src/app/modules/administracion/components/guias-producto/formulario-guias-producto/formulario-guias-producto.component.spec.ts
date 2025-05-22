import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioGuiasProductoComponent } from './formulario-guias-producto.component';

describe('FormularioGuiasProductoComponent', () => {
  let component: FormularioGuiasProductoComponent;
  let fixture: ComponentFixture<FormularioGuiasProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioGuiasProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioGuiasProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
