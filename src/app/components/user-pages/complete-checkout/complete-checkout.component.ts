import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-complete-checkout',
    templateUrl: './complete-checkout.component.html',
    styleUrls: ['./complete-checkout.component.less'],
})
export class CompleteCheckoutComponent implements OnInit {
    constructor(
        private location: Location,
        private invoiceService: InvoiceService,
        private router: Router,
        private storageSerivce: StorageService
    ) {}

    ngOnInit(): void {
        const invoiceId = this.storageSerivce.getItemLocal('sucInvoice');
        const isLogin = this.storageSerivce.getItemLocal('userInfo');
        const params = {
            status: 'PAID',
            invoiceId: invoiceId,
        };
        this.invoiceService.updateStatus(params).subscribe({
            next: (res) => {
                setTimeout(() => {
                    if (isLogin) this.router.navigate(['/user/profile']);
                    else this.router.navigate(['/user/home']);
                }, 300);
            },
        });
    }
}
