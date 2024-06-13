import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProductRoutingModule } from './product-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { RadioButtonModule } from 'primeng/radiobutton';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToolbarModule } from 'primeng/toolbar';
import { ProductComponent } from './product.component';
import { SharedModule } from '../../shared/shared.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { ProductImportComponent } from './product-import/product-import.component';
import { ProductImportDetailComponent } from './product-import-detail/product-import-detail.component';
import { MultiSelectModule } from 'primeng/multiselect';

import { PanelModule } from 'primeng/panel';
import { CalendarModule } from 'primeng/calendar';
import { PaginatorModule } from 'primeng/paginator';
@NgModule({
    declarations: [
        ProductComponent,
        ProductDetailComponent,
        ProductImportComponent,
        ProductImportDetailComponent,
    ],
    imports: [
        CommonModule,
        ProductRoutingModule,
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
        CalendarModule,
        PaginatorModule,
    ],
    providers: [MessageService, DialogService],
})
export class ProductModule {}
