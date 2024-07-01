import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/base.component';
import { MerchantService } from 'src/app/services/merchant.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-merchant-shop',
    templateUrl: './merchant-shop.component.html',
    styleUrls: ['./merchant-shop.component.scss'],
})
export class MerchantShopComponent extends BaseComponent implements OnInit {
    merchantDetail;
    merchantId;
    constructor(
        private router: Router,
        private merchantService: MerchantService,
        private productService: ProductService
    ) {
        super();
        this.merchantId = window.location.href.slice(
            window.location.href.lastIndexOf('/') + 1
        );
    }

    ngOnInit(): void {
        this.getData();
    }
    getData() {
        this.merchantService.getMerchant(this.merchantId).subscribe({
            next: (res) => {
                this.merchantDetail = res;
            },
        });
    }
}
