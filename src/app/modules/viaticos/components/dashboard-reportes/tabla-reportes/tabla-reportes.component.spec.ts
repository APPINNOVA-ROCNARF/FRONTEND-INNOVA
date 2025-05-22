import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaReportesComponent } from './tabla-reportes.component';

describe('TablaReportesComponent', () => {
  let component: TablaReportesComponent;
  let fixture: ComponentFixture<TablaReportesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaReportesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaReportesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
