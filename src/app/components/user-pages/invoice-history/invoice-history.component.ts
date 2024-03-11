import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { InvoiceService } from 'src/app/services/invoice.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-invoice-history',
    templateUrl: './invoice-history.component.html',
    styleUrls: ['./invoice-history.component.less'],
})
export class InvoiceHistoryComponent implements OnInit {
    cart;
    cartId;
    selectedProducts: any[] = [];
    isLogin: boolean = false;
    originalData: any;
    constructor(
        private storageService: StorageService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private invoiceService: InvoiceService
    ) {}

    ngOnInit(): void {
        this.isLogin = this.storageService.getDataFromCookie('jwtToken');
        if (this.isLogin) this.getDetail();
        else this.router.navigate(['/auth/login']);
    }

    getDetail() {
        this.invoiceService
            .getPaymentDetail(
                this.storageService.getItemLocal('currentInvoice')
            )
            .subscribe({
                next: (res) => {
                    this.cart = res;
                    this.originalData = _.cloneDeep(res);
                    this.selectedProducts = this.originalData.filter(
                        (item) => item.isSelected
                    );
                },
                error: () => console.log('error'),
            });
    }

    onGlobalFilter(cart: any, event: Event) {
        cart.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }
}
