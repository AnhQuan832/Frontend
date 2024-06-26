import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickviewLiveComponent } from './quickview-live.component';

describe('QuickviewLiveComponent', () => {
  let component: QuickviewLiveComponent;
  let fixture: ComponentFixture<QuickviewLiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickviewLiveComponent]
    });
    fixture = TestBed.createComponent(QuickviewLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
