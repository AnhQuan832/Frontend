import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { VoucherManagementComponent } from '../voucher-management.component';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { VoucherService } from 'src/app/services/voucher.service';
import { ProductComponent } from '../../product/product.component';

@Component({
    selector: 'app-voucher-detail',
    templateUrl: './voucher-detail.component.html',
    styleUrls: ['./voucher-detail.component.scss'],
})
export class VoucherDetailComponent implements OnInit {
    voucherOption = [
        {
            id: 'FLAT',
            name: 'Flat',
        },
        {
            id: 'PERCENTAGE',
            name: 'Percentage',
        },
    ];
    voucher;
    name;
    model;
    addVoucherForm = this.builder.group({
        voucherId: this.builder.control(''),
        type: this.builder.control('PERCENTAGE', Validators.required),
        value: this.builder.control('', Validators.required),
        price: this.builder.control('', Validators.required),
        maxValue: this.builder.control('', Validators.required),
        minInvoiceValue: this.builder.control('', Validators.required),
    });
    constructor(
        private voucherSerivce: VoucherService,
        private builder: FormBuilder,
        private ref: DynamicDialogRef,
        private voucherCpn: ProductComponent,
        private config: DynamicDialogConfig
    ) {}
    ngOnInit(): void {
        this.model = this.config?.data;
        if (this.model) this.addVoucherForm.patchValue(this.model);
    }

    addNewVoucher() {
        if (!this.model)
            this.voucherSerivce
                .createVoucher(this.addVoucherForm.value)
                .subscribe({
                    next: (res) => {
                        this.ref.close();
                        this.voucherCpn.showToast('Success', 'success');
                    },
                });
        else
            this.voucherSerivce
                .updateVoucher(this.addVoucherForm.value)
                .subscribe({
                    next: (res) => {
                        this.ref.close();
                        this.voucherCpn.showToast('Success', 'success');
                    },
                });
    }
}
