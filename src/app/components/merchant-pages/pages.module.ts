import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PagesRoutingModule } from './pages-routing.module';
import { ProductComponent } from './product/product.component';
import { SharedModule } from '../shared/shared.module';
import { OrderComponent } from './order/order.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { MessageService } from 'primeng/api';
import { MessageModule } from 'primeng/message';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { ToolbarModule } from 'primeng/toolbar';
import { VoucherManagementComponent } from './voucher-management/voucher-management.component';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        PagesRoutingModule,
        SharedModule,
        MultiSelectModule,
        InputTextModule,
        InputNumberModule,
        MessageModule,
        DialogModule,
        ToastModule,
        TableModule,
        ToolbarModule,
    ],
})
export class PagesModule {}
