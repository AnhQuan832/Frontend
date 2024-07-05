import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { MerchantService } from 'src/app/services/merchant.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-merchant-request',
    templateUrl: './merchant-request.component.html',
    styleUrls: ['./merchant-request.component.scss'],
})
export class MerchantRequestComponent {
    listMerchant: any = [];

    first: number = 1;
    totalRecords: number = 1;
    items: MenuItem[];
    selectedMerchant: any;
    constructor(
        private merchantService: MerchantService,
        private storageService: StorageService,
        private router: Router,
        private messageService: ToastMessageService
    ) {}

    ngOnInit() {
        this.getMerchantList();
        this.initMenuItems();
    }
    getMerchantList() {
        const params = { isApproved: false, page: this.first, size: 10 };
        this.merchantService.getAllMerchant(params).subscribe({
            next: (data) => {
                this.listMerchant = data.content;
                this.totalRecords = data.totalElements;
                // this.listMerchant.forEach((merchant) => {
                //     if (!merchant.rating) {
                //         merchant.rating = 0;
                //     }
                // });
            },
        });
    }

    onMerchantSelected(merchant) {
        this.storageService.setItemLocal('merchantDetail', merchant);
        this.router.navigate([
            `merchant/merchant/detail/${merchant.merchantId}`,
        ]);
    }

    onPageChange(event) {
        this.first = event.page;
        this.getMerchantList();
    }

    initMenuItems() {
        this.items = [
            {
                label: 'View Detail',
                command: () => {
                    this.onMerchantSelected(this.selectedMerchant);
                },
            },
            {
                label: 'Accept',
                command: () => {
                    this.merchantService
                        .approveMerchant(this.selectedMerchant.merchantId)
                        .subscribe({
                            next: (data) => {
                                this.getMerchantList();
                                this.messageService.showMessage(
                                    '',
                                    'Merchant has been approved',
                                    'success'
                                );
                            },
                        });
                },
            },
            {
                label: 'Reject',
                command: () => {
                    this.merchantService
                        .disapproveMerchant(this.selectedMerchant.merchantId)
                        .subscribe({
                            next: (data) => {
                                this.getMerchantList();
                                this.messageService.showMessage(
                                    '',
                                    'Merchant has been rejected',
                                    'success'
                                );
                            },
                        });
                },
            },
        ];
    }
}
