import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MerchantService } from 'src/app/services/merchant.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-merchant',
    templateUrl: './merchant.component.html',
    styleUrls: ['./merchant.component.scss'],
})
export class MerchantComponent {
    listMerchant: any;

    constructor(
        private merchantService: MerchantService,
        private storageService: StorageService,
        private router: Router
    ) {}

    ngOnInit() {
        this.getMerchantList();
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
}
