import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalViaticosComponent } from './total-solicitud-viatico.component';

describe('TotalViaticosComponent', () => {
  let component: TotalViaticosComponent;
  let fixture: ComponentFixture<TotalViaticosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TotalViaticosComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalViaticosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
