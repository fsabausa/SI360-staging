import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PatSelectedCheckComponent } from './pat-selected-check.component';

describe('PatSelectedCheckComponent', () => {
  let component: PatSelectedCheckComponent;
  let fixture: ComponentFixture<PatSelectedCheckComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PatSelectedCheckComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PatSelectedCheckComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
