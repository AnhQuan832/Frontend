import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AvatarModule } from 'primeng/avatar';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DataViewModule } from 'primeng/dataview';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { DialogService, DynamicDialogModule } from 'primeng/dynamicdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { GalleriaModule } from 'primeng/galleria';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { MessageModule } from 'primeng/message';
import { MessagesModule } from 'primeng/messages';
import { MultiSelectModule } from 'primeng/multiselect';
import { PaginatorModule } from 'primeng/paginator';
import { RadioButtonModule } from 'primeng/radiobutton';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { MessageService } from 'primeng/api';
import { InputTextModule } from 'primeng/inputtext';
import { PagesRoutingModule } from '../merchant-pages/pages-routing.module';
import { ProductComponent } from '../merchant-pages/product/product.component';
import { AddBrand } from './add brand/add-brand.component';
import { AddCategory } from './add category/add-category.component';
import { AddProduct } from './add product/add-product.component';
import { AddSubCategory } from './add sub-category/add-sub-category.component';

@NgModule({
    declarations: [AddBrand, AddCategory, AddProduct, AddSubCategory],
    imports: [
        CommonModule,
        PagesRoutingModule,
        ButtonModule,
        FormsModule,
        DividerModule,
        DividerModule,
        PaginatorModule,
        DataViewModule,
        RadioButtonModule,
        BreadcrumbModule,
        DynamicDialogModule,
        TableModule,
        InputTextareaModule,
        GalleriaModule,
        AvatarModule,
        ToastModule,
        MessageModule,
        MessagesModule,
        TagModule,
        ConfirmDialogModule,
        TooltipModule,
        DropdownModule,
        InputNumberModule,
        FileUploadModule,
        ReactiveFormsModule,
        MultiSelectModule,
        InputTextModule,
        InputNumberModule,
    ],
    providers: [MessageService, DialogService, ProductComponent],
})
export class SharedModule {}
