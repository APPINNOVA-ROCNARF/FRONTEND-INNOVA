import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaCoberturaMedicosComponent } from './tabla-cobertura-medicos.component';

describe('TablaCoberturaMedicosComponent', () => {
  let component: TablaCoberturaMedicosComponent;
  let fixture: ComponentFixture<TablaCoberturaMedicosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaCoberturaMedicosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaCoberturaMedicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
