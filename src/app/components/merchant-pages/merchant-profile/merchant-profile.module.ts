import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantProfileRoutingModule } from './merchant-profile-routing.module';
import { MerchantProfileComponent } from './merchant-profile.component';

@NgModule({
    declarations: [MerchantProfileComponent],
    imports: [CommonModule, MerchantProfileRoutingModule],
})
export class MerchantProfileModule {}
