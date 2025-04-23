import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EstadoCicloComponent } from './estado-ciclo.component';

describe('EstadoCicloComponent', () => {
  let component: EstadoCicloComponent;
  let fixture: ComponentFixture<EstadoCicloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EstadoCicloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EstadoCicloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
