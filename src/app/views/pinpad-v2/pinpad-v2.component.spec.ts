import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PinpadV2Component } from './pinpad-v2.component';

describe('PinpadV2Component', () => {
  let component: PinpadV2Component;
  let fixture: ComponentFixture<PinpadV2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PinpadV2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PinpadV2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
