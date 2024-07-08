import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice.service';
import { StorageService } from 'src/app/services/storage.service';
import { forkJoin } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';

@Component({
    selector: 'app-complete-checkout',
    templateUrl: './complete-checkout.component.html',
    styleUrls: ['./complete-checkout.component.less'],
})
export class CompleteCheckoutComponent extends BaseComponent implements OnInit {
    constructor(
        private location: Location,
        private invoiceService: InvoiceService,
        private router: Router,
        private storageService: StorageService
    ) {
        super();
    }

    ngOnInit(): void {
        const invoiceIds = this.storageService.getItemLocal('sucInvoice');
        const isLogin = !!this.getToken();
        // const updateRequests = invoiceIds.map((invoiceId) => {
        //     const params = {
        //         status: 'PAID',
        //         invoiceId: invoiceId,
        //     };
        //     return this.invoiceService.updateStatus(params);
        // });

        // forkJoin(updateRequests).subscribe({
        //     next: (responses) => {
        //         setTimeout(() => {
        //             if (isLogin) {
        //                 this.router.navigate(['/user/profile']);
        //             } else {
        //                 this.router.navigate(['/user/home']);
        //             }
        //         }, 500);
        //     },
        //     error: (err) => {
        //         console.error('Error updating invoices:', err);
        //     },
        // });

        // if (isLogin) {
        //     this.router.navigate(['/user/profile']);
        // } else {
        //     this.router.navigate(['/user/home']);
        // }
    }
}
