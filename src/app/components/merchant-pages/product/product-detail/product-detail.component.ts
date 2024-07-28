import { AfterViewInit, Component, OnInit } from '@angular/core';
import { Validators, FormBuilder } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MenuItem, MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { FileHandler } from 'src/app/model/FileHandler';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { AddBrand } from '../../../shared/add brand/add-brand.component';
import { AddCategory } from '../../../shared/add category/add-category.component';
import { AddSubCategory } from '../../../shared/add sub-category/add-sub-category.component';
import { forkJoin } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.less'],
    providers: [DialogService],
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
    imgs: FileHandler[] = [];
    attribute = {
        COLOR: [],
        SIZE: [],
    };
    isAddAtt: boolean = false;
    brandOption;
    categoryOption;
    subCategoryOption;
    ref: DynamicDialogRef;
    product: any;
    listImages: string[];
    listColor: any[] = [];
    listSize: any[] = [];
    selectedColor: any;
    selectedSize: any;
    listDetailVariety: any[] = [];
    removedImgs: Array<string> = new Array();
    isAddAttribute: boolean = false;
    attPrice = 0;
    listUpdateVariety = [];
    userId;
    addProductForm = this.builder.group({
        productId: this.builder.control(''),
        name: this.builder.control('', Validators.required),
        brand: this.builder.control('', Validators.required),
        category: this.builder.control('', Validators.required),
        subCategory: this.builder.control('', Validators.required),
        price: this.builder.control('', Validators.required),
        detail: this.builder.control(''),
        description: this.builder.control(''),
        petTypeId: this.builder.control(1),
        size: this.builder.control(''),
        color: this.builder.control(''),
        varieties: this.builder.control([]),
        length: this.builder.control(''),
        width: this.builder.control(''),
        height: this.builder.control(''),
        weight: this.builder.control(''),
        merchantId: this.builder.control(''),
    });

    constructor(
        private productService: ProductService,
        private builder: FormBuilder,
        private sanitizer: DomSanitizer,
        private dialogService: DialogService,
        private storageService: StorageService,
        private messageService: MessageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.initialize();
    }

    private async initialize() {
        this.product = this.storageService.getItemLocal('currentProduct');
        this.userId = this.getUserInfo().userId;
        await this.productService
            .getProduct(this.product.productId, this.userId)
            .subscribe({
                next: (res) => {
                    this.product = res;
                    this.listImages = this.product.images;
                    this.addProductForm.patchValue(this.product);
                    this.addProductForm.patchValue({
                        category: this.product.subCategory.category,
                    });
                    this.addProductForm.patchValue({
                        merchantId: this.getUserInfo().merchantId,
                    });
                    this.productService.getAttribute().subscribe({
                        next: (res) => {
                            this.attribute = res;
                        },
                    });
                    this.getBrand();
                    this.getCate();
                    this.getSubCate();
                    this.getProduct();
                },
            });
    }

    public getBrand() {
        this.productService.getBrand().subscribe({
            next: (res) => (this.brandOption = res),
        });
    }

    public getCate() {
        this.productService.getCategory().subscribe({
            next: (res) => (this.categoryOption = res),
        });
    }

    public getSubCate(cateId?) {
        this.productService
            .getSubCategory(
                cateId || this.product.subCategory.category.categoryId
            )
            .subscribe({
                next: (res) => (this.subCategoryOption = res),
            });
    }

    getProduct() {
        this.productService
            .getProduct(this.product.productId, this.userId)
            .subscribe({
                next: (res) => {
                    this.product = res;
                    this.product.varieties.forEach((item) => {
                        this.listDetailVariety.push({
                            ...item,
                            ...item.varietyAttributes,
                        });
                    });
                    console.log(this.product);
                    this.listSize = [];
                    this.listColor = [];
                    (this.product.varietyAttributeList || []).forEach(
                        (item) => {
                            if (item.type === 'SIZE') this.listSize.push(item);
                            else this.listColor.push(item);
                        }
                    );
                },
            });
    }

    setFormData(product: any) {
        const formData = new FormData();
        const data = product.value;
        formData.append(
            'productDTO',
            new Blob([JSON.stringify(data)], { type: 'application/json' })
        );
        for (let i = 0; i < this.imgs.length; i++) {
            formData.append(
                'images',
                this.imgs[i].file,
                this.imgs[i].file.name
            );
        }
        return formData;
    }

    toBlobImgs() {
        const formData = new FormData();
        if (this.removedImgs.length)
            this.prepareFormData(
                formData,
                this.removedImgs,
                'deletedImages',
                true
            );
        if (this.imgs.length)
            this.prepareFormData(formData, this.imgs, 'newImages', false);
        return formData;
    }

    onAttribute(event, data, type) {
        const items = document.querySelectorAll(`.${type}`);
        items.forEach((item) => {
            item.classList.remove('active');
            item.removeAttribute('style');
        });
        event.srcElement.classList.add('active');
        if (type === 'color') this.selectedColor = data;
        else this.selectedSize = data;
    }

    // handleChangeAttribute() {
    //   console.log(this.listDetailVariety)
    //   console.log(this.selectedColor)
    //   console.log(this.selectedSize)
    //   const att = this.listDetailVariety.find(item => item[0].attributeId === this.selectedSize.attributeId && item[1].attributeId === this.selectedColor.attributeId)
    //   this.attPrice = att.price;
    // }
    // setDefaultAttribute() {
    //   let colorItem, sizeItem;
    //   if (this.listColor.length > 0) {
    //     colorItem = document.getElementById(this.listColor[0].attributeId)
    //     colorItem.classList.add("active")
    //     this.selectedColor = this.listColor[0];
    //   }
    //   if (this.listSize.length > 0) {
    //     sizeItem = document.getElementById(this.listSize[0].attributeId)
    //     sizeItem.classList.add("active")
    //     this.selectedSize = this.listSize[0];
    //   }

    // }

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

        this.ref.onClose.subscribe((res) => {
            this.productService
                .getSubCategory(this.product.subCategory.category.categoryId)
                .subscribe({
                    next: (res) => (this.subCategoryOption = res),
                });
        });
    }

    onAddAttribute(type: string) {
        this.productService
            .addNewAttribute(
                this.addProductForm.get(`${type}`).value,
                this.product.productId
            )
            .subscribe({
                next: (res: any) => {
                    if (res.meta.statusCode === '0_2_s') {
                        this.messageService.add({
                            key: 'toast',
                            severity: 'success',
                            detail: 'Success',
                        });
                        this.getProduct();
                    } else {
                        this.messageService.add({
                            key: 'toast',
                            severity: 'error',
                            detail: 'Attribute existed',
                        });
                    }
                },
            });
    }

    onSaveProduct() {
        if (this.imgs.length || this.removedImgs.length)
            this.productService
                .updateImages(
                    this.addProductForm.get('productId').value,
                    this.toBlobImgs()
                )
                .subscribe({
                    next: (res) => {
                        this.getProduct();
                    },
                });
        const requests = [];
        Object.values(this.listUpdateVariety).forEach((variety) => {
            const data = {
                varietyId: variety.varietyId,
                stockAmount: variety.stockAmount,
            };
            requests.push(this.productService.updateVarietyStock(data));
        });
        forkJoin(requests).subscribe();
        this.addProductForm.patchValue({ varieties: this.product.varieties });
        this.productService.updateProduct(this.addProductForm.value).subscribe({
            next: (res) => {
                this.getProduct();

                this.messageService.add({
                    key: 'toast',
                    severity: 'success',
                    detail: 'Success',
                });
            },
            error: (err) => {
                // this.messageService.add({
                //     key: 'toast',
                //     severity: 'error',
                //     detail: 'Something went wrong',
                // });
                console.log(err);
            },
        });
    }

    onShowAttribute() {
        this.isAddAtt = true;
    }

    public onSelectFiles(event) {
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

    deleteImg(imgLink) {
        this.removedImgs.push(imgLink);
        this.listImages = this.listImages.filter((e) => e !== imgLink);
    }

    onDeleteAtt(vari) {
        this.productService.deleteAttribute(vari).subscribe({
            next: () =>
                this.messageService.add({
                    key: 'toast',
                    severity: 'success',
                    detail: 'Deleted',
                }),
            error: () =>
                this.messageService.add({
                    key: 'toast',
                    severity: 'error',
                    detail: 'Delete failed',
                }),
        });
    }
    onChangeQty(vari, value) {
        vari.stockAmount = value;
    }

    updateVariety(variety, value) {
        variety.stockAmount = value;
        this.listUpdateVariety[variety.varietyId] = variety;
    }

    onCateChange(event) {
        this.getSubCate(event.value.categoryId);
    }
}
