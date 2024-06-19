import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantProfileRoutingModule } from './merchant-profile-routing.module';
import { MerchantProfileComponent } from './merchant-profile.component';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    declarations: [MerchantProfileComponent],
    imports: [CommonModule, MerchantProfileRoutingModule, TooltipModule],
})
export class MerchantProfileModule {}
