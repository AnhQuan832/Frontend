import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VoucherManagementRoutingModule } from './voucher-management-routing.module';
import { VoucherManagementComponent } from './voucher-management.component';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { PanelModule } from 'primeng/panel';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { VoucherDetailComponent } from './voucher-detail/voucher-detail.component';

@NgModule({
    declarations: [VoucherManagementComponent, VoucherDetailComponent],
    imports: [
        CommonModule,
        VoucherManagementRoutingModule,
        TableModule,
        FileUploadModule,
        FormsModule,
        ButtonModule,
        RippleModule,
        ToastModule,
        ToolbarModule,
        RatingModule,
        InputTextModule,
        InputTextareaModule,
        DropdownModule,
        RadioButtonModule,
        InputNumberModule,
        DialogModule,
        SharedModule,
        ToastModule,
        DividerModule,
        ReactiveFormsModule,
        FormsModule,
        TooltipModule,
        MultiSelectModule,
        PanelModule,
    ],
})
export class VoucherManagementModule {}
