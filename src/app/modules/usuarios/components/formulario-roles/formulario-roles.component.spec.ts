import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FormularioRolesComponent } from './formulario-roles.component';

describe('FormularioRolesComponent', () => {
  let component: FormularioRolesComponent;
  let fixture: ComponentFixture<FormularioRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormularioRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FormularioRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
