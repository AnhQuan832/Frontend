import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminLiveComponent } from './admin-live.component';

describe('AdminLiveComponent', () => {
  let component: AdminLiveComponent;
  let fixture: ComponentFixture<AdminLiveComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminLiveComponent]
    });
    fixture = TestBed.createComponent(AdminLiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
