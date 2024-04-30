import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product.service';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss'],
})
export class LiveComponent implements OnInit {
    listAllProduct = [];
    listProductForLive = [];
    isOnLive = false;
    constructor(private productService: ProductService) {}
    ngOnInit(): void {}

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
        this.productService.getAllProduct().subscribe({
            next: (res) => {
                this.listAllProduct = res;
                this.listProductForLive = this.listAllProduct.filter(
                    (item) => item.isLive === true
                );
            },
            error: (err) => {
                console.log(err);
            },
        });
    }
}
