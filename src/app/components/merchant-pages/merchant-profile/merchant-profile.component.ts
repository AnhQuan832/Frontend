import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { BaseComponent } from 'src/app/base.component';
import { CartService } from 'src/app/services/cart.service';
import { MerchantService } from 'src/app/services/merchant.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { StreamService } from 'src/app/services/stream.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-merchant-profile',
    templateUrl: './merchant-profile.component.html',
    styleUrls: ['./merchant-profile.component.scss'],
})
export class MerchantProfileComponent extends BaseComponent implements OnInit {
    merchantDetail;
    constructor(
        private storageService: StorageService,
        private router: Router,
        private messageService: ToastMessageService,
        private streamService: StreamService,
        private productService: ProductService,
        private cartService: CartService,
        private merchantService: MerchantService
    ) {
        super();
    }
    ngOnInit(): void {
        this.getProfile();
    }

    getProfile() {
        const info = this.getUserInfo();
        this.merchantService.getMerchantDetail(info.merchantId).subscribe({
            next: (res) => {
                this.merchantDetail = res;
            },
        });
    }

    urlToFileType(file) {
        const fileType = file.slice(file.lastIndexOf('.') + 1, file.length);
        return fileType;
    }
}
