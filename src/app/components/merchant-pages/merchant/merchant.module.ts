import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantRoutingModule } from './merchant-routing.module';
import { MerchantComponent } from './merchant.component';
import { MerchantRequestComponent } from './merchant-request/merchant-request.component';
import { TableModule } from 'primeng/table';
import { MerchantDetailComponent } from './merchant-detail/merchant-detail.component';
import { PaginatorModule } from 'primeng/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { RatingModule } from 'primeng/rating';
import { MenuModule } from 'primeng/menu';
import { RequestDetailComponent } from './request-detail/request-detail.component';
import { Tag, TagModule } from 'primeng/tag';

@NgModule({
    declarations: [
        MerchantComponent,
        MerchantRequestComponent,
        MerchantDetailComponent,
        RequestDetailComponent,
    ],
    imports: [
        CommonModule,
        MerchantRoutingModule,
        TableModule,
        PaginatorModule,
        ReactiveFormsModule,
        FormsModule,
        ButtonModule,
        RatingModule,
        MenuModule,
        TagModule,
    ],
})
export class MerchantModule {}
