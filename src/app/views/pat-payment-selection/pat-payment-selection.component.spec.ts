import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatPaymentSelectionComponent } from './pat-payment-selection.component';

describe('PatPaymentSelectionComponent', () => {
  let component: PatPaymentSelectionComponent;
  let fixture: ComponentFixture<PatPaymentSelectionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatPaymentSelectionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatPaymentSelectionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
