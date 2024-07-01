import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MerchantShopComponent } from './merchant-shop.component';

describe('MerchantShopComponent', () => {
  let component: MerchantShopComponent;
  let fixture: ComponentFixture<MerchantShopComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MerchantShopComponent]
    });
    fixture = TestBed.createComponent(MerchantShopComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
