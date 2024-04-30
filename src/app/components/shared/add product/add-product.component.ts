import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, Validators } from '@angular/forms';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { AddBrand } from '../add brand/add-brand.component';
import { AddCategory } from '../add category/add-category.component';
import { AddSubCategory } from '../add sub-category/add-sub-category.component';
import { DomSanitizer } from '@angular/platform-browser';
import { FileHandler } from 'src/app/model/FileHandler';
import { MessageService } from 'primeng/api';
import { ProductService } from 'src/app/services/product.service';
import { ProductComponent } from '../../merchant-pages/product/product.component';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-charts',
    templateUrl: './add-product.component.html',
    styleUrls: ['./add-product.component.scss'],
    providers: [DialogService],
})
export class AddProduct extends BaseComponent implements OnInit {
    avatarFile: any;
    avatarUrl: any;
    imgs: FileHandler[] = [];
    brandOption;
    categoryOption;
    attribute = {
        COLOR: [],
        SIZE: [],
    };
    subCategoryOption;
    addProductForm = this.builder.group({
        name: this.builder.control('', Validators.required),
        brand: this.builder.control('', Validators.required),
        category: this.builder.control('', Validators.required),
        subCategory: this.builder.control('', Validators.required),
        price: this.builder.control('', Validators.required),
        detail: this.builder.control(''),
        description: this.builder.control(''),
        petTypeId: this.builder.control(''),
        size: this.builder.control(''),
        color: this.builder.control(''),
        varietyAttributeList: this.builder.control([]),
        length: this.builder.control(''),
        width: this.builder.control(''),
        height: this.builder.control(''),
        weight: this.builder.control(''),
    });

    constructor(
        private productService: ProductService,
        private router: Router,
        private builder: FormBuilder,
        private sanitizer: DomSanitizer,
        private dialogService: DialogService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private productCpn: ProductComponent
    ) {
        super();
    }
    ngOnInit(): void {
        this.initialize();
    }

    private initialize() {
        this.productService.getAttribute().subscribe({
            next: (res) => {
                this.attribute = res;
            },
        });
        this.productService.getBrand().subscribe({
            next: (res) => (this.brandOption = res),
        });
        this.productService.getCategory().subscribe({
            next: (res) => (this.categoryOption = res),
        });
    }

    setUpFormData(product: any) {
        const formData = new FormData();
        this.prepareFormData(formData, product.value, 'productDTO', true);
        for (let i = 0; i < this.imgs.length; i++) {
            this.prepareFormData(formData, this.imgs[i].file, 'images', false);
        }

        return formData;
    }

    onAddBrand() {
        this.ref = this.dialogService.open(AddBrand, {
            header: 'Add new Brand',
        });
        this.ref.onClose.subscribe((res) => {
            this.productService.getBrand().subscribe({
                next: (res) => (this.brandOption = res),
            });
        });
    }

    onAddCategory() {
        this.ref = this.dialogService.open(AddCategory, {
            header: 'Add new Category',
        });
        this.ref.onClose.subscribe((res) => {
            this.productService.getCategory().subscribe({
                next: (res) => (this.categoryOption = res),
            });
        });
    }

    onAddSubCategory() {
        this.ref = this.dialogService.open(AddSubCategory, {
            header: 'Add new SubCategory',
        });
    }

    onAddProduct() {
        this.addProductForm.patchValue({ petTypeId: '1' });
        const listVariety = [
            ...this.addProductForm.get('color').value,
            ...this.addProductForm.get('size').value,
        ];
        this.addProductForm.get('varietyAttributeList').setValue(listVariety);
        this.productService
            .addNewProduct(this.setUpFormData(this.addProductForm))
            .subscribe({
                next: (res) => {
                    if (res) {
                        this.messageService.add({
                            key: 'toast',
                            severity: 'success',
                            detail: 'Add product success',
                        });
                        setTimeout(() => {
                            this.ref.close();
                        }, 100);
                    } else {
                        this.messageService.add({
                            key: 'toast',
                            severity: 'error',
                            detail: 'Add product fail',
                        });
                    }
                },
                error: (err) => console.log(err),
            });
    }

    onCategoryChange(event) {
        this.productService.getSubCategory(event.value.categoryId).subscribe({
            next: (res) => (this.subCategoryOption = res),
        });
    }

    public onSelectFiles(event) {
        this.imgs = [];
        for (let i = 0; i < event.currentFiles.length; i++) {
            const file = event.currentFiles[i];
            const fileHandler: FileHandler = {
                file: file,
                url: this.sanitizer.bypassSecurityTrustUrl(
                    window.URL.createObjectURL(file)
                ),
            };
            this.imgs.push(fileHandler);
        }
    }

    onRemoveFile(event) {
        const newImgs = this.imgs.filter(
            (file) => file.file.name !== event.file.name
        );
        this.imgs = newImgs;
    }
}
