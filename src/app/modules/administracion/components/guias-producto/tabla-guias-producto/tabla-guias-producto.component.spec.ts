import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TablaGuiasProductoComponent } from './tabla-guias-producto.component';

describe('TablaGuiasProductoComponent', () => {
  let component: TablaGuiasProductoComponent;
  let fixture: ComponentFixture<TablaGuiasProductoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TablaGuiasProductoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TablaGuiasProductoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
