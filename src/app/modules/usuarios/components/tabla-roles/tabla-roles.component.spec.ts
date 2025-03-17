import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaRolesComponent } from './tabla-roles.component';

describe('TablaRolesComponent', () => {
  let component: TablaRolesComponent;
  let fixture: ComponentFixture<TablaRolesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaRolesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaRolesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
