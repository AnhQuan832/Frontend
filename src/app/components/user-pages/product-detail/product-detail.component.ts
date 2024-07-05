import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import * as _ from 'lodash';
import { StorageService } from 'src/app/services/storage.service';
import { ProductService } from 'src/app/services/product.service';
import { InvoiceService } from 'src/app/services/invoice.service';
import { CartService } from 'src/app/services/cart.service';
import { BaseComponent } from 'src/app/base.component';
import { Toast } from 'primeng/toast';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { v4 as uuidv4 } from 'uuid';
import { s } from '@fullcalendar/core/internal-common';
import { MerchantService } from 'src/app/services/merchant.service';
import { ChatComponent } from '../chat/chat.component';

@Component({
    selector: 'app-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    providers: [ChatComponent],
})
export class ProductDetailComponent extends BaseComponent implements OnInit {
    product;
    listImg;
    numberOfProduct = 0;
    isLoading = false;
    listVarieties;
    listColor: any[] = [];
    listSize: any[] = [];
    selectedColor: any;
    selectedSize: any;
    listDetailVariety: any[] = [];
    attPrice = 0;
    selectedVariety;
    isActiveColor = false;
    isActiveSize = false;
    isLogin: boolean = false;
    isDisableBuy: boolean = false;
    mostProd;
    mostBuy;
    merchant;
    similarProd;
    constructor(
        private storageService: StorageService,
        private router: Router,
        private productService: ProductService,
        private cartService: CartService,
        private messageService: ToastMessageService,
        private invoiceService: InvoiceService,
        private merchantService: MerchantService,
        private chatCpn: ChatComponent
    ) {
        super();
    }
    ngOnInit(): void {
        this.initialize();
        setTimeout(() => {
            this.setDefaultAttribute();
        }, 1000);
    }

    initialize() {
        this.isLogin = this.getUserInfo() ? true : false;
        let uuid = sessionStorage.getItem('uuid');
        if (!uuid) {
            uuid = uuidv4();
            sessionStorage.setItem('uuid', uuid);
        }
        const viewerId = this.isLogin ? this.getUserInfo().userId : uuidv4();
        if (!this.isLogin)
            this.cartService.getUnauthCart().subscribe({
                next: (res) => {
                    this.storageService.setItemLocal('cart', res);
                },
            });
        this.product = this.storageService.getItemLocal('currentProduct');
        const productId = window.location.href.slice(
            window.location.href.lastIndexOf('/') + 1
        );
        this.listVarieties = this.product?.varieties;
        this.isLoading = true;
        this.productService.getProdMost(7).subscribe({
            next: (res) => (this.mostProd = res),
        });
        this.productService.getProdMostBuy(7).subscribe((data) => {
            this.mostBuy = data;
        });
        this.productService
            .getProduct(productId || this.product.productId, viewerId)
            .subscribe({
                next: (res) => {
                    this.product = res;
                    this.getMerchant(res.merchantId);
                    this.getSimilarProd(res.subCategory.category.categoryId);
                    if (this.product.detail) {
                        this.product.detail = this.product.detail.replace(
                            /(?:\r\n|\r|\n)/g,
                            '<br>'
                        );
                    }
                    this.product.varieties.forEach((item) => {
                        this.listDetailVariety.push({
                            ...item,
                            ...item.varietyAttributes,
                        });
                    });
                    (this.product.varietyAttributeList || []).forEach(
                        (item) => {
                            if (item.type === 'SIZE')
                                this.listSize.push({ ...item, active: true });
                            else this.listColor.push({ ...item, active: true });
                        }
                    );
                    this.isLoading = false;
                },
            });
        if (!this.isLogin)
            this.cartService.getUnauthCart().subscribe({
                next: (res) => this.storageService.setItemLocal('cart', res),
            });
    }

    getMerchant(merchantId) {
        this.merchantService.getMerchant(merchantId).subscribe({
            next: (res) => {
                this.merchant = res;
            },
        });
    }
    setDefaultAttribute() {
        let colorItem, sizeItem;
        if (this.listColor.length > 0) {
            colorItem = document.getElementById(this.listColor[0].attributeId);
            colorItem.classList.add('active');
            this.selectedColor = this.listColor[0];
        }
        if (this.listSize.length > 0) {
            sizeItem = document.getElementById(this.listSize[0].attributeId);
            sizeItem.classList.add('active');
            this.selectedSize = this.listSize[0];
        }
        this.handleChangeAttribute();
    }
    onAttribute(event, data, type) {
        const items = document.querySelectorAll(`.${type}`);
        items.forEach((item) => {
            item.classList.remove('active');
            item.removeAttribute('style');
        });
        event.srcElement.classList.add('active');
        if (type === 'color') {
            this.selectedColor = data;
            // const filter = this.listDetailVariety.filter((vari) => {
            //   vari.varietyAttributes.some(
            //     (att) => att.attributeId === this.selectedColor.attributeId
            //   );
            // });
            const varietiesWithAttribute = this.listDetailVariety.filter(
                (variety) =>
                    variety.varietyAttributes.some(
                        (attribute) =>
                            attribute.attributeId ===
                            this.selectedColor.attributeId
                    )
            );
            console.log(varietiesWithAttribute);
        } else this.selectedSize = data;
        this.handleChangeAttribute();
    }

    handleChangeAttribute() {
        this.numberOfProduct = 0;
        this.selectedVariety = this.listDetailVariety.find((item) => {
            if (this.selectedSize && this.selectedColor)
                return (
                    (item[1].attributeId === this.selectedSize.attributeId &&
                        item[0].attributeId ===
                            this.selectedColor.attributeId) ||
                    (item[0].attributeId === this.selectedSize.attributeId &&
                        item[1].attributeId === this.selectedColor.attributeId)
                );
            else if (this.selectedSize && !this.selectedColor) {
                if (item?.varietyAttributes.length > 1)
                    return (
                        item?.varietyAttributes[1]?.attributeId ===
                        this.selectedSize.attributeId
                    );
                return (
                    item?.varietyAttributes[0]?.attributeId ===
                    this.selectedSize.attributeId
                );
            } else if (!this.selectedSize && this.selectedColor)
                return (
                    item.varietyAttributes[0].attributeId ===
                    this.selectedColor.attributeId
                );
            return false;
        });
        this.attPrice = this.selectedVariety
            ? this.selectedVariety.price
            : this.product.price;
    }

    toggleActiveColor() {
        this.isActiveColor = !this.isActiveColor;
    }

    toggleActiveSize() {
        this.isActiveSize = !this.isActiveSize;
    }

    onChangeQty(event) {
        if (event > this.selectedVariety.stockAmount) {
            this.numberOfProduct = this.selectedVariety.stockAmount;
            this.isDisableBuy = true;
        } else {
            this.attPrice = this.selectedVariety.price * event;
            this.numberOfProduct = event;
            this.isDisableBuy = false;
        }
    }

    addToCart() {
        const data = {
            quantity: this.numberOfProduct,
            totalItemPrice: this.attPrice,
            varietyId: this.selectedVariety.varietyId,
        };
        if (this.isLogin) {
            this.cartService
                .addToCart(this.numberOfProduct, this.selectedVariety.varietyId)
                .subscribe({
                    next: (res) =>
                        this.messageService.showMessage(
                            '',
                            'Added to cart',
                            'success'
                        ),
                    error: () => {
                        this.messageService.showMessage(
                            '',
                            'Cannot add to cart',
                            'success'
                        );
                    },
                });
        } else {
            const cartId = this.storageService.getItemLocal('cart').cartId;

            this.cartService
                .addToCartUnAuth(
                    cartId,
                    this.numberOfProduct,
                    this.selectedVariety.varietyId
                )
                .subscribe({
                    next: (res) =>
                        this.messageService.showMessage(
                            '',
                            'Added to cart',
                            'success'
                        ),
                    error: () => {
                        this.messageService.showMessage(
                            '',
                            'Cannot add to cart',
                            'success'
                        );
                    },
                });
        }
    }

    buyNow() {
        const data = {
            ...this.selectedVariety,
            quantity: this.numberOfProduct,
            image: this.product.images[0],
            name: this.product.name,
        };
        this.storageService.setItemLocal('cart', [data]);
        this.router.navigate(['/user/check-out']);
    }

    onProdClick(item) {
        this.storageService.setItemLocal('currentProduct', item);
        this.router.navigate([`/user/product-detail/${item.productId}`]);
        // location.href = `https://pescue-shop.vercel.app/user/product-detail/${item.productId}`;
        window.location.reload();
    }

    goToMerchant() {
        this.router.navigate([`/user/shop/${this.merchant.merchantId}`]);
    }

    chat() {
        sessionStorage.setItem('reciepientID', this.merchant.merchantId);
        this.chatCpn.connect();
        setTimeout(() => {
            this.chatCpn.sendValue(
                'Hi',
                this.getUserInfo().userId,
                this.merchant.userId
            );
            // this.router.navigate(['/user/message']);
        }, 1000);
    }

    getSimilarProd(categoryId) {
        this.productService
            .getAllProduct({
                page: 1,
                size: 5,
                categoryId: categoryId,
            })
            .subscribe({
                next: (res) => {
                    this.similarProd = res;
                },
            });
    }
}
