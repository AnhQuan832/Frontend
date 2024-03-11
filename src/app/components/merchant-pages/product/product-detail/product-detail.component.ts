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

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.less'],
    providers: [DialogService],
})
export class ProductDetailComponent implements OnInit {
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
    });

    constructor(
        private productSerivce: ProductService,
        private builder: FormBuilder,
        private sanitizer: DomSanitizer,
        private dialogService: DialogService,
        private storageService: StorageService,
        private messageService: MessageService
    ) {}

    ngOnInit(): void {
        this.initialize();
    }

    private initialize() {
        this.product = this.storageService.getItemLocal('currentProduct');
        this.listImages = this.product.images;
        this.addProductForm.patchValue(this.product);
        this.addProductForm.patchValue({
            category: this.product.subCategory.category,
        });

        this.productSerivce.getAttribute().subscribe({
            next: (res) => {
                this.attribute = res;
            },
        });
        this.getBrand();
        this.getCate();
        this.getSubCate();
        this.getProduct();
    }

    public getBrand() {
        this.productSerivce.getBrand().subscribe({
            next: (res) => (this.brandOption = res),
        });
    }

    public getCate() {
        this.productSerivce.getCategory().subscribe({
            next: (res) => (this.categoryOption = res),
        });
    }

    public getSubCate() {
        this.productSerivce
            .getSubCategory(this.product.subCategory.category.categoryId)
            .subscribe({
                next: (res) => (this.subCategoryOption = res),
            });
    }

    getProduct() {
        this.productSerivce.getProduct(this.product.productId).subscribe({
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
                this.product.varietyAttributeList.forEach((item) => {
                    if (item.type === 'SIZE') this.listSize.push(item);
                    else this.listColor.push(item);
                });
            },
        });
    }

    prepareFormData(product: any) {
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
        for (let i = 0; i < this.imgs.length; i++) {
            formData.append(
                'newImages',
                this.imgs[i].file,
                this.imgs[i].file.name
            );
        }
        formData.append(
            'deletedImages',
            new Blob([JSON.stringify(this.removedImgs)], {
                type: 'application/json',
            })
        );
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
            this.productSerivce.getBrand().subscribe({
                next: (res) => (this.brandOption = res),
            });
        });
    }

    onAddCategory() {
        this.ref = this.dialogService.open(AddCategory, {
            header: 'Add new Category',
        });

        this.ref.onClose.subscribe((res) => {
            this.productSerivce.getCategory().subscribe({
                next: (res) => (this.categoryOption = res),
            });
        });
    }

    onAddSubCategory() {
        this.ref = this.dialogService.open(AddSubCategory, {
            header: 'Add new SubCategory',
        });

        this.ref.onClose.subscribe((res) => {
            this.productSerivce
                .getSubCategory(this.product.subCategory.category.categoryId)
                .subscribe({
                    next: (res) => (this.subCategoryOption = res),
                });
        });
    }

    onAddAttribute(type: string) {
        this.productSerivce
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
        console.log(this.product);
        // this.productSerivce.updateImages(this.addProductForm.get('productId').value, this.toBlobImgs()).subscribe({
        //   next: (res) => {
        //     console.log(res)
        //   }
        // })
        this.addProductForm.patchValue({ varieties: this.product.varieties });
        this.productSerivce.updateProduct(this.addProductForm.value).subscribe({
            next: (res) => {
                this.messageService.add({
                    key: 'toast',
                    severity: 'success',
                    detail: 'Success',
                });
                this.getProductDetail(
                    this.addProductForm.get('productId').value
                );
            },
            error: (err) => {
                this.messageService.add({
                    key: 'toast',
                    severity: 'error',
                    detail: 'Something went wrong',
                });
                console.log(err);
            },
        });
    }

    getProductDetail(id) {
        this.productSerivce.getProduct(id).subscribe({
            next: (res) => {
                this.storageService.setItemLocal('currentProduct', res);
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
        console.log(vari);
        this.productSerivce.deleteAttribute(vari).subscribe({
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
}
