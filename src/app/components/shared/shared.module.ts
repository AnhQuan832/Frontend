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
import { FooterComponent } from './footer/footer.component';
import { NavBarComponent } from './nav-bar/nav-bar.component';
import { ProductCardComponent } from './product-card/product-card.component';
import { RatingComponent } from './rating/rating.component';
import { RatingModule } from 'primeng/rating';
import { MenuModule } from 'primeng/menu';
import { LogoComponent } from './logo/logo.component';
import { QuantityComponent } from './quantity/quantity.component';
import { ProductImageComponent } from './product-image/product-image.component';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
    declarations: [
        AddBrand,
        AddCategory,
        AddProduct,
        AddSubCategory,
        FooterComponent,
        NavBarComponent,
        ProductCardComponent,
        RatingComponent,
        LogoComponent,
        QuantityComponent,
        ProductImageComponent,
    ],
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
        RatingModule,
        MenuModule,
        SkeletonModule,
    ],
    exports: [
        AddBrand,
        AddCategory,
        AddProduct,
        AddSubCategory,
        FooterComponent,
        NavBarComponent,
        ProductCardComponent,
        RatingComponent,
        LogoComponent,
        QuantityComponent,
        ProductImageComponent,
    ],
    providers: [MessageService, DialogService, ProductComponent],
})
export class SharedModule {}
