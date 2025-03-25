import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaBaseComponent } from './tabla-base.component';

describe('TablaBaseComponent', () => {
  let component: TablaBaseComponent;
  let fixture: ComponentFixture<TablaBaseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaBaseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
