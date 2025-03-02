import { ComponentFixture, TestBed } from '@angular/core/testing';

import { KardexChicksComponent } from './kardex-chicks.component';

describe('KardexChicksComponent', () => {
  let component: KardexChicksComponent;
  let fixture: ComponentFixture<KardexChicksComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [KardexChicksComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(KardexChicksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
