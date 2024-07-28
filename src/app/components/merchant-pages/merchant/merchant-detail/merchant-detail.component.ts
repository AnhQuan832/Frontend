import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/base.component';
import { MerchantService } from 'src/app/services/merchant.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-merchant-detail',
    templateUrl: './merchant-detail.component.html',
    styleUrls: ['./merchant-detail.component.scss'],
})
export class MerchantDetailComponent extends BaseComponent implements OnInit {
    @Input() isRequest: boolean = false;
    merchantDetail;
    constructor(
        private merchantService: MerchantService,
        private storageService: StorageService,
        private messageService: ToastMessageService,
        private router: Router
    ) {
        super();
    }
    ngOnInit(): void {
        this.getMerchantDetail();
    }
    getMerchantDetail() {
        this.merchantDetail =
            this.storageService.getItemLocal('merchantDetail');
        const merchantId = window.location.href.slice(
            window.location.href.lastIndexOf('/') + 1
        );
        this.merchantService.getMerchantDetail(merchantId).subscribe({
            next: (res) => {
                this.merchantDetail = res;
            },
        });
    }

    urlToFileType(url: string): string {
        return url.slice(url.lastIndexOf('.') + 1, url.lastIndexOf('?'));
    }
    acceptRequest() {
        this.merchantService
            .approveMerchant(this.merchantDetail.merchantId)
            .subscribe({
                next: (data) => {
                    this.messageService.showMessage(
                        '',
                        'Merchant has been approved',
                        'success'
                    );
                    this.router.navigate(['/merchant/merchant/request']);
                },
            });
    }

    rejectRequest() {
        this.merchantService
            .disapproveMerchant(this.merchantDetail.merchantId)
            .subscribe({
                next: (data) => {
                    this.messageService.showMessage(
                        '',
                        'Merchant has been rejected',
                        'success'
                    );
                    this.router.navigate(['/merchant/merchant/request']);
                },
            });
    }

    suspendMerchant() {
        this.merchantService
            .suspendMerchant(this.merchantDetail.merchantId)
            .subscribe({
                next: (data) => {
                    this.messageService.showMessage(
                        '',
                        'Merchant has been suspended',
                        'success'
                    );
                    this.getMerchantDetail();

                    this.router.navigate(['/merchant/merchant']);
                },
            });
    }

    unSuspentMerchant() {
        this.merchantService
            .unsuspendMerchant(this.merchantDetail.merchantId)
            .subscribe({
                next: (data) => {
                    this.messageService.showMessage(
                        '',
                        'Merchant has been unsuspended',
                        'success'
                    );
                    this.getMerchantDetail();
                },
            });
    }

    banLive() {
        this.merchantService.banLive(this.merchantDetail.merchantId).subscribe({
            next: (data) => {
                this.messageService.showMessage(
                    '',
                    'Merchant has been banned from live',
                    'success'
                );
                this.getMerchantDetail();
            },
        });
    }

    unBanLive() {
        this.merchantService
            .unBanLive(this.merchantDetail.merchantId)
            .subscribe({
                next: (data) => {
                    this.messageService.showMessage(
                        '',
                        'Merchant has been unbanned from live',
                        'success'
                    );
                    this.getMerchantDetail();
                },
            });
    }
}
