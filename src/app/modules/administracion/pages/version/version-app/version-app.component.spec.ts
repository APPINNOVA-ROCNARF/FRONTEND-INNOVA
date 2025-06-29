import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VersionAppComponent } from './version-app.component';

describe('VersionAppComponent', () => {
  let component: VersionAppComponent;
  let fixture: ComponentFixture<VersionAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VersionAppComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VersionAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
