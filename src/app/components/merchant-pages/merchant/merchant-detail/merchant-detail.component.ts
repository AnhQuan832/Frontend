import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { MerchantService } from 'src/app/services/merchant.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-merchant-detail',
    templateUrl: './merchant-detail.component.html',
    styleUrls: ['./merchant-detail.component.scss'],
})
export class MerchantDetailComponent extends BaseComponent implements OnInit {
    merchantDetail;
    constructor(
        private merchantService: MerchantService,
        private storageService: StorageService
    ) {
        super();
    }
    ngOnInit(): void {
        this.getMerchantDetail();
    }
    getMerchantDetail() {
        this.merchantDetail =
            this.storageService.getItemLocal('merchantDetail');
        console.log(location.pathname.split('/'));
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
    acceptRequest() {}

    rejectRequest() {}
}
