import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaViaticosComponent } from './tabla-solicitud-viatico.component';

describe('TablaViaticosComponent', () => {
  let component: TablaViaticosComponent;
  let fixture: ComponentFixture<TablaViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaViaticosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
