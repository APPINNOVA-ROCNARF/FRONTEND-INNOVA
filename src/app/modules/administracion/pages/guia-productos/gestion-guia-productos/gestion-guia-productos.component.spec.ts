import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionGuiaProductosComponent } from './gestion-guia-productos.component';

describe('GestionGuiaProductosComponent', () => {
  let component: GestionGuiaProductosComponent;
  let fixture: ComponentFixture<GestionGuiaProductosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionGuiaProductosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GestionGuiaProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
