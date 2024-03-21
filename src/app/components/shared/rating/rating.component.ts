import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-rating',
    templateUrl: './rating.component.html',
    styleUrls: ['./rating.component.less'],
})
export class RatingComponent implements OnInit {
    product;
    formGroup;
    rateStar = 1;
    message;
    constructor(
        private productService: ProductService,
        private config: DynamicDialogConfig,
        private ref: DynamicDialogRef,
        private messageSerivce: MessageService
    ) {}
    ngOnInit(): void {
        this.product = this.config.data;
        console.log(this.product);
    }

    addReview() {
        const data = {
            productId: this.product.productId,
            score: this.rateStar,
            message: this.message,
        };
        this.productService.addReview(data).subscribe({
            next: (res) => {
                this.messageSerivce.add({
                    key: 'toast',
                    severity: 'success',
                    detail: 'Added review',
                });
                this.ref.close();
            },
        });
    }
}
