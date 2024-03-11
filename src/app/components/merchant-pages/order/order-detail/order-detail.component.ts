import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MessageService } from 'primeng/api';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { OrderService } from 'src/app/services/order.service';
import * as _ from 'lodash';

@Component({
    selector: 'app-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
    listTransactions;
    data;
    constructor(
        private formBuilder: FormBuilder,
        private invoiceService: OrderService,
        private dialogSerivce: DialogService,
        private config: DynamicDialogConfig,
        private msgService: MessageService,
        private ref: DynamicDialogRef
    ) {
        this.data = _.cloneDeep(this.config.data);
        this.data.address =
            this.data.streetName +
            ', ' +
            this.data.wardName +
            ', ' +
            this.data.districtName +
            ', ' +
            this.data.cityName;
        this.data.paymentType =
            this.data.paymentType === 'CREDIT_CARD' ? 'Credit card' : 'Cash';
    }
    ngOnInit(): void {
        this.invoiceService.getPaymentDetail(this.data.invoiceId).subscribe({
            next: (res) => {
                this.listTransactions = res;
            },
        });
    }
    updateStatus(status) {
        this.invoiceService
            .updateStatus({
                status: status,
                invoiceId: this.data.invoiceId,
            })
            .subscribe({
                next: () => {
                    this.msgService.add({
                        key: 'toast',
                        severity: 'success',
                        detail: 'Success',
                    });
                    this.ref.close();
                },
            });
    }
}
