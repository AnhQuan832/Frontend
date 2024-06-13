import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/services/merchant.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-merchant-request',
    templateUrl: './merchant-request.component.html',
    styleUrls: ['./merchant-request.component.scss'],
})
export class MerchantRequestComponent {
    listMerchant: any;

    first: number = 1;
    totalRecords: number = 1;
    constructor(
        private merchantService: MerchantService,
        private storageService: StorageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getMerchantList();
    }
    getMerchantList() {
        const params = { isApproved: false, offset: this.first, limit: 10 };
        this.merchantService.getAllMerchant(params).subscribe({
            next: (data) => {
                this.listMerchant = data;
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
        console.log(event);
    }
}
