import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveOrderComponent } from './live-order.component';

describe('LiveOrderComponent', () => {
  let component: LiveOrderComponent;
  let fixture: ComponentFixture<LiveOrderComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveOrderComponent]
    });
    fixture = TestBed.createComponent(LiveOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
