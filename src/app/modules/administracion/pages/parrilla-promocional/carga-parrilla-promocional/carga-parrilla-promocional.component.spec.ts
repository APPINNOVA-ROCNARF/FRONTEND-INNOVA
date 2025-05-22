import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CargaParrillaPromocionalComponent } from './carga-parrilla-promocional.component';

describe('CargaParrillaPromocionalComponent', () => {
  let component: CargaParrillaPromocionalComponent;
  let fixture: ComponentFixture<CargaParrillaPromocionalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CargaParrillaPromocionalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CargaParrillaPromocionalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
