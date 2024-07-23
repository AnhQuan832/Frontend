import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { AddProduct } from '../../shared/add product/add-product.component';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss'],
})
export class ProductComponent extends BaseComponent {
    productDialog: boolean = false;

    deleteProductDialog: boolean = false;

    deleteProductsDialog: boolean = false;

    products: any[] = [].constructor(10);

    product: any = {};

    selectedProducts: any[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    ref: DynamicDialogRef;

    first: number = 1;
    totalRecords: number = 10;
    isLoading: boolean = true;
    constructor(
        private productService: ProductService,
        private router: Router,
        private dialogService: DialogService,
        private storageService: StorageService,
        private messageService: MessageService,
        private layoutService: LayoutService
    ) {
        super();
    }

    ngOnInit() {
        this.getProducts(true, { page: this.first, size: 10 });
    }

    getProducts(isInit = false, paging?) {
        this.isLoading = true;
        this.productService
            .getAllProduct({
                merchantId: this.getUserInfo().merchantId,
                ...paging,
            })
            .subscribe({
                next: (res) => {
                    this.isLoading = false;
                    if (isInit) this.totalRecords = res[0].totalRecord;
                    this.products = res;
                },
            });
    }

    addNewProduct() {
        this.ref = this.dialogService.open(AddProduct, {
            header: 'Add a new Product',
            width: this.layoutService.isDesktop() ? '50%' : '100%',
        });

        this.ref.onClose.subscribe((res) => {
            this.getProducts(true, { page: this.first, size: 10 });
        });
    }

    getSeverity(status: string) {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
                return 'info';
            default:
                return 'danger';
        }
    }

    onRowSelect(data) {
        this.storageService.setItemLocal('currentProduct', data);
        this.router.navigate([
            `merchant/product/product-detail/${data.productId}`,
        ]);
    }

    public showToast(message, type) {
        this.messageService.add({
            key: 'toast',
            severity: type,
            detail: message,
        });
    }

    openNew() {
        this.product = {};
        this.submitted = false;
        this.productDialog = true;
    }

    deleteSelectedProducts() {
        this.deleteProductsDialog = true;
    }

    confirmDeleteSelected() {
        this.deleteProductsDialog = false;
        this.products = this.products.filter(
            (val) => !this.selectedProducts.includes(val)
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Products Deleted',
            life: 3000,
        });
        this.selectedProducts = [];
    }

    confirmDelete() {
        this.deleteProductDialog = false;
        this.products = this.products.filter(
            (val) => val.id !== this.product.id
        );
        this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Product Deleted',
            life: 3000,
        });
        this.product = {};
    }

    hideDialog() {
        this.productDialog = false;
        this.submitted = false;
    }

    saveProduct() {
        this.submitted = true;

        if (this.product.name?.trim()) {
            if (this.product.id) {
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    .value
                    ? this.product.inventoryStatus.value
                    : this.product.inventoryStatus;
                this.products[this.findIndexById(this.product.id)] =
                    this.product;
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Updated',
                    life: 3000,
                });
            } else {
                this.product.id = this.createId();
                this.product.code = this.createId();
                this.product.image = 'product-placeholder.svg';
                // @ts-ignore
                this.product.inventoryStatus = this.product.inventoryStatus
                    ? this.product.inventoryStatus.value
                    : 'INSTOCK';
                this.products.push(this.product);
                this.messageService.add({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'Product Created',
                    life: 3000,
                });
            }

            this.products = [...this.products];
            this.productDialog = false;
            this.product = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.products.length; i++) {
            if (this.products[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars =
            'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    onPageChange(event) {
        console.log(event);
        this.getProducts(false, { page: event.page + 1, size: 10 });
    }
}
