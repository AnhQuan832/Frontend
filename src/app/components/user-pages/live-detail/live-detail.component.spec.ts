import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveDetailComponent } from './live-detail.component';

describe('LiveDetailComponent', () => {
  let component: LiveDetailComponent;
  let fixture: ComponentFixture<LiveDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveDetailComponent]
    });
    fixture = TestBed.createComponent(LiveDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
