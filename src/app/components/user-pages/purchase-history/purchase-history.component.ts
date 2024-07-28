import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { forkJoin } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { RatingComponent } from '../../shared/rating/rating.component';
import { ChatComponent } from '../chat/chat.component';
import { MerchantRequestComponent } from '../merchant-request/merchant-request.component';

@Component({
    selector: 'app-purchase-history',
    templateUrl: './purchase-history.component.html',
    styleUrls: ['./purchase-history.component.scss'],
    providers: [ChatComponent],
})
export class PurchaseHistoryComponent extends BaseComponent implements OnInit {
    isLoading: boolean = false;
    ref: DynamicDialogRef;
    isBought = false;
    listTransactions;
    cart;
    cartId;
    selectedInvoice;
    isLogin: boolean = false;
    originalData: any;
    constructor(
        private invoiceService: InvoiceService,
        private dialogService: DialogService,
        private chat: ChatComponent,
        private router: Router,
        private msgService: ToastMessageService,
        private storageService: StorageService,
        private layoutService: LayoutService
    ) {
        super();
    }
    ngOnInit(): void {
        this.getData();
    }
    getData() {
        this.isLoading = true;
        this.invoiceService.getPaymentInfo().subscribe({
            next: (res) => {
                this.isLoading = false;
                this.listTransactions = res;
            },
        });
    }

    onRowSelect(row) {
        this.selectedInvoice = row;
        if (row.invoiceId)
            this.invoiceService.getPaymentDetail(row.invoiceId).subscribe({
                next: (res) => {
                    this.cart = res;
                    const element = document.getElementById('invoice');
                    element.scrollIntoView();
                },
            });
        else
            this.invoiceService
                .getLivePaymentDetail(row.liveInvoiceId)
                .subscribe({
                    next: (res) => {
                        this.cart = res;
                        const element = document.getElementById('invoice');
                        element.scrollIntoView();
                    },
                });
        this.isBought = row.status === 'COMPLETED';
    }

    addRating(row) {
        this.ref = this.dialogService.open(RatingComponent, {
            header: 'Write a Review',
            data: row,
        });
    }

    contactAdmin(invoice) {
        sessionStorage.setItem('reciepientID', 'USER_1697033158735');
        this.chat.connect();
        setTimeout(() => {
            this.chat.setReceipientId('USER_1697033158735');
            this.chat.sendValue('Start');
            this.router.navigate(['/user/message']);
        }, 1000);
    }

    getSeverity(status: string) {
        switch (status) {
            case 'COMPLETED':
            case 'PAID':
                return 'success';
            case 'PENDING':
            case 'COD':
                return 'info';
            case 'RETURN':
                return 'warning';
            default:
                return 'danger';
        }
    }

    registerMerchant() {
        this.dialogService.open(MerchantRequestComponent, {
            width: this.layoutService.isDesktop() ? '50%' : '100%',
        });
    }

    updateStatus(status) {
        this.invoiceService
            .updateStatus({
                invoiceId: this.selectedInvoice.invoiceId,
                status: status,
            })
            .subscribe({
                next: (res) => {
                    this.msgService.showMessage(
                        'Marked as received',
                        '',
                        'success'
                    );
                    this.getData();
                },
            });
    }
}
