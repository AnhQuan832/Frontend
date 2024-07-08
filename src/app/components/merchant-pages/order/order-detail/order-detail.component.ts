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
import { ToastMessageService } from 'src/app/services/toast-message.service';

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
        private msgService: ToastMessageService,
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
                    this.msgService.showMessage(
                        '',
                        'Update status successfully!',
                        'success'
                    );
                    this.ref.close();
                },
            });
    }
}
