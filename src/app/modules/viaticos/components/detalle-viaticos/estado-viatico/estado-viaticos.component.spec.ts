import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoViaticosComponent } from './estado-viaticos.component';

describe('EstadoViaticosComponent', () => {
  let component: EstadoViaticosComponent;
  let fixture: ComponentFixture<EstadoViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoViaticosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
