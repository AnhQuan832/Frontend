import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StreamVideoComponent } from './stream-video.component';

describe('StreamVideoComponent', () => {
  let component: StreamVideoComponent;
  let fixture: ComponentFixture<StreamVideoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StreamVideoComponent]
    });
    fixture = TestBed.createComponent(StreamVideoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
