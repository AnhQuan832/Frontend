import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-live-detail',
    templateUrl: './live-detail.component.html',
    styleUrls: ['./live-detail.component.scss'],
})
export class LiveDetailComponent extends BaseComponent implements OnInit {
    listProduct = [];
    constructor(private productService: ProductService) {
        super();
    }
    ngOnInit(): void {}

    getAllProduct() {
        this.productService.getAllProduct().subscribe({
            next: (res) => {
                this.listProduct = res;
            },
        });
    }
}
