import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoadingmodalComponent } from './loadingmodal.component';

describe('LoadingmodalComponent', () => {
  let component: LoadingmodalComponent;
  let fixture: ComponentFixture<LoadingmodalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoadingmodalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoadingmodalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
