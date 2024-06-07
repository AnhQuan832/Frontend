import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from './merchant.component';
import { MerchantRequestComponent } from './merchant-request/merchant-request.component';
import { TableModule } from 'primeng/table';
import { MerchantDetailComponent } from './merchant-detail/merchant-detail.component';

@NgModule({
    declarations: [MerchantComponent, MerchantRequestComponent, MerchantDetailComponent],
    imports: [CommonModule, MerchantRoutingModule, TableModule],
})
export class MerchantModule {}
