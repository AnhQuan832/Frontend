import { Component } from '@angular/core';
import { MerchantService } from 'src/app/services/merchant.service';

@Component({
    selector: 'app-merchant',
    templateUrl: './merchant.component.html',
    styleUrls: ['./merchant.component.scss'],
})
export class MerchantComponent {
    listMerchant: any;

    constructor(private merchantService: MerchantService) {}

    ngOnInit() {
        this.getMerchantList();
    }
    getMerchantList() {
        this.merchantService.getAllMerchant().subscribe({
            next: (data) => {
                this.listMerchant = data;
            },
        });
    }
}
