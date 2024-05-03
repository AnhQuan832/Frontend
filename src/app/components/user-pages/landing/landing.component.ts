import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.less'],
})
export class HomeComponent implements OnInit {
    mostProd;
    constructor(
        private cartService: CartService,
        private storageService: StorageService,
        private productService: ProductService,
        private router: Router,
        private messageService: ToastMessageService
    ) {}
    ngOnInit(): void {
        const localCart = this.storageService.getItemLocal('localCart');
        if (localCart) {
            localCart.forEach((item) => {
                this.cartService
                    .addToCart(item.quantity, item.varietyId)
                    .subscribe();
            });
            localStorage.removeItem('localCart');
        }

        this.productService.getProdMost(4).subscribe({
            next: (res) => (this.mostProd = res),
        });
    }

    onProdClick(id) {
        this.router.navigate([`/user/product-detail/${id}`]);
    }

    onLiveClick(id?) {
        this.router.navigate([`/user/live/${id}`]);
    }
}
