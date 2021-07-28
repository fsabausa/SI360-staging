import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationMessageComponent } from './information-message.component';

describe('InformationMessageComponent', () => {
  let component: InformationMessageComponent;
  let fixture: ComponentFixture<InformationMessageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InformationMessageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InformationMessageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
