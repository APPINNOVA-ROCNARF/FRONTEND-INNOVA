import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetalleViaticosComponent } from './detalle-viaticos.component';

describe('DetalleViaticosComponent', () => {
  let component: DetalleViaticosComponent;
  let fixture: ComponentFixture<DetalleViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetalleViaticosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetalleViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
