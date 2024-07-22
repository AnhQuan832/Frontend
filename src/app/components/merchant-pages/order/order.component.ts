import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef, DialogService } from 'primeng/dynamicdialog';
import { Table } from 'primeng/table';
import { StorageService } from 'src/app/services/storage.service';
import { VoucherService } from 'src/app/services/voucher.service';
import { VoucherDetailComponent } from '../voucher-management/voucher-detail/voucher-detail.component';
import { OrderService } from 'src/app/services/order.service';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import * as moment from 'moment';
@Component({
    selector: 'app-order',
    templateUrl: './order.component.html',
    styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
    selectedVouchers;
    listVoucher;
    ref: DynamicDialogRef;
    rangeDates;
    totalRecords: number = 1;
    first: number = 0;
    size = 10;
    constructor(
        private router: Router,
        private dialogService: DialogService,
        private storageSerive: StorageService,
        private messageService: MessageService,
        private orderService: OrderService
    ) {}

    ngOnInit() {
        this.getData(true);
    }

    getData(isInit = false, params?) {
        this.orderService
            .getPaymentInfo({ page: this.first, size: 10, ...params })
            .subscribe({
                next: (res) => {
                    this.listVoucher = res.content;
                    if (isInit) this.totalRecords = res.totalElements;
                },
            });
    }

    openDetail(data?) {
        this.ref = this.dialogService.open(OrderDetailComponent, {
            position: 'center',
            data: data,
            width: '650px',
        });

        this.ref.onClose.subscribe(() => {
            this.getData();
        });
    }

    showToast() {}
    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains'
        );
    }

    getSeverity(status: string) {
        switch (status) {
            case 'COMPLETED':
                return 'success';
            case 'PENDING':
            case 'PAID':
                return 'info';
            case 'RETURN':
                return 'warning';
            default:
                return 'danger';
        }
    }

    onDateChange(clear?) {
        if (clear) this.getData();
        else {
            const params = {
                fromDate: moment(this.rangeDates[0]).set({
                    hour: 7,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                }),
                toDate: moment(this.rangeDates[1]).set({
                    hour: 7,
                    minute: 0,
                    second: 0,
                    millisecond: 0,
                }),
                groupType: 'DAY',
            };
            this.getData(false, params);
        }
    }

    onPageChange(event) {
        this.first = event.page + 1;
        this.getData();
    }
}
