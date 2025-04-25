import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaViaticoComponent } from './tabla-viatico.component';

describe('TablaViaticoComponent', () => {
  let component: TablaViaticoComponent;
  let fixture: ComponentFixture<TablaViaticoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaViaticoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaViaticoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
