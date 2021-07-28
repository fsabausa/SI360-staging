import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePINComponent } from './change-pin.component';

describe('ChangePINComponent', () => {
  let component: ChangePINComponent;
  let fixture: ComponentFixture<ChangePINComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChangePINComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePINComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
