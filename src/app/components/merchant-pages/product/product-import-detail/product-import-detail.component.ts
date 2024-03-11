import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { switchMap } from 'rxjs';
import { ProductService } from 'src/app/services/product.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-product-import-detail',
    templateUrl: './product-import-detail.component.html',
    styleUrls: ['./product-import-detail.component.scss'],
})
export class ProductImportDetailComponent implements OnInit {
    importProductForm = this.builder.group({
        products: this.builder.control('', Validators.required),
        brand: this.builder.control(''),
        category: this.builder.control(''),
        subCategory: this.builder.control(''),
    });
    attribute = {
        COLOR: [],
        SIZE: [],
    };

    listColor: any[] = [];
    listSize: any[] = [];
    listVari = [];
    selectedProducts = [];
    products;
    listDetails = [];
    model;

    constructor(
        private builder: FormBuilder,
        private productSerive: ProductService,
        private messageService: MessageService,
        private ref: DynamicDialogRef,
        private config: DynamicDialogConfig
    ) {}
    ngOnInit(): void {
        if (this.config?.data) {
            this.model = true;
            this.listDetails = _.cloneDeep(this.config.data);
            for (let i = 0; i < this.listDetails.length; i++)
                this.getImportDetail(this.listDetails[i], i);
        } else
            this.productSerive.getAllProduct().subscribe({
                next: (res) => (this.products = res),
            });
    }

    onImport() {
        let data = [];
        this.listDetails.forEach((prod) =>
            data.push(
                ...prod.varieties
                    .map(({ varietyId, price, quantity }) => ({
                        importPrice: price,
                        varietyId,
                        quantity,
                    }))
                    .filter((item) => item.quantity !== 0)
            )
        );
        this.productSerive.processImport(data).subscribe({
            next: (res) => {
                this.messageService.add({
                    key: 'toast',
                    severity: 'success',
                    detail: 'Import Success',
                });
                this.ref.close();
            },
            error: (res) =>
                this.messageService.add({
                    key: 'toast',
                    severity: 'error',
                    detail: 'Import Failed',
                }),
        });
    }

    handleChangeProduct(event) {
        this.listDetails = event.value;
        for (let i = 0; i < event.value.length; i++)
            this.productSerive.getProduct(event.value[i].productId).subscribe({
                next: (res) => {
                    this.listSize = [];
                    this.listColor = [];
                    this.listDetails[i].varieties = res.varieties.map(
                        (item) => ({ ...item, quantity: 0 })
                    );
                    res.varietyAttributeList.forEach((item) => {
                        if (item.type === 'SIZE') this.listSize.push(item);
                        else this.listColor.push(item);
                    });
                },
            });
    }

    getImportDetail(invoice, index) {
        const params = {
            invoiceId: invoice.importInvoiceId,
            productId: invoice.productId,
        };
        this.productSerive.getInvoiceDetail(params).subscribe({
            next: (res) => {
                this.listDetails[index].varieties = res;
            },
        });
    }
}
