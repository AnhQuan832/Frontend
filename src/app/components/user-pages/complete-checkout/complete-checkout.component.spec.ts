import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompleteCheckoutComponent } from './complete-checkout.component';

describe('CompleteCheckoutComponent', () => {
  let component: CompleteCheckoutComponent;
  let fixture: ComponentFixture<CompleteCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompleteCheckoutComponent]
    });
    fixture = TestBed.createComponent(CompleteCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
