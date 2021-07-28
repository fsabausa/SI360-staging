import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckUpdateDialogComponent } from './check-update-dialog.component';

describe('CheckUpdateDialogComponent', () => {
  let component: CheckUpdateDialogComponent;
  let fixture: ComponentFixture<CheckUpdateDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckUpdateDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
