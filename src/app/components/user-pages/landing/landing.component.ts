import { Component, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { StreamService } from 'src/app/services/stream.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.less'],
})
export class HomeComponent implements OnInit {
    mostProd;
    listStream = [];
    constructor(
        private cartService: CartService,
        private storageService: StorageService,
        private productService: ProductService,
        private router: Router,
        private messageService: ToastMessageService,
        private streamService: StreamService
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
        this.getAllStream();
    }

    getAllStream() {
        const params = { offset: 1, limit: 10 };
        this.streamService.getAllStream(params).subscribe({
            next: (res) => (this.listStream = res),
        });
    }

    onProdClick(id) {
        this.router.navigate([`/user/product-detail/${id}`]);
    }

    onLiveClick(stream) {
        this.router.navigate([`/user/live/${stream.sessionId}`]);
    }

    setupSwiper() {
        const progressCircle = document.querySelector(
            '.autoplay-progress svg'
        ) as SVGAElement;
        const progressContent = document.querySelector(
            '.autoplay-progress span'
        );

        const swiperEl = document.querySelector('swiper-container');
        swiperEl.addEventListener('autoplaytimeleft', (e) => {
            const [swiper, time, progress] = e.detail;
            progressCircle.style.setProperty(
                '--progress',
                (1 - progress).toString()
            );
            progressContent.textContent = `${Math.ceil(time / 1000)}s`;
        });
    }
}
