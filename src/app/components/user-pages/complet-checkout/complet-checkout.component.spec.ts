import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CompletCheckoutComponent } from './complet-checkout.component';

describe('CompletCheckoutComponent', () => {
  let component: CompletCheckoutComponent;
  let fixture: ComponentFixture<CompletCheckoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CompletCheckoutComponent]
    });
    fixture = TestBed.createComponent(CompletCheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
