import { Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss'],
})
export class LiveComponent extends BaseComponent implements OnInit {
    listAllProduct = [];
    listProductForLive = [];
    isOnLive = false;
    cameraFound = false;
    constructor(private productService: ProductService) {
        super();
    }
    ngOnInit(): void {
        this.getProductForLive();
    }

    getCamera() {
        let video = document.querySelector('#videoElement') as HTMLVideoElement;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log('Something went wrong!');
                });
        }
    }

    getProductForLive() {
        const info = this.getUserInfo();
        this.productService
            .getAllProduct({ merchantId: info.merchantId })
            .subscribe({
                next: (res) => {
                    this.listAllProduct = res;
                    this.listProductForLive = res;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    pinProduct(product) {}
    selectItem(item) {}
}
