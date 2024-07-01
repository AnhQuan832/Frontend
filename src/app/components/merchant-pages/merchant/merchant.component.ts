import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { MerchantService } from 'src/app/services/merchant.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-merchant',
    templateUrl: './merchant.component.html',
    styleUrls: ['./merchant.component.scss'],
})
export class MerchantComponent {
    listMerchant: any;
    first: number = 1;
    totalRecords: number = 1;
    items: MenuItem[];
    selectedMerchant;
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
        this.merchantService
            .getAllMerchant({ isApproved: true, pageNumber: 1 })
            .subscribe({
                next: (data) => {
                    this.listMerchant = data;
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
        console.log(event);
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
