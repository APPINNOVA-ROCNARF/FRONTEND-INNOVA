import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalRechazoComponent } from './modal-rechazo.component';

describe('ModalRechazoComponent', () => {
  let component: ModalRechazoComponent;
  let fixture: ComponentFixture<ModalRechazoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModalRechazoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModalRechazoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
