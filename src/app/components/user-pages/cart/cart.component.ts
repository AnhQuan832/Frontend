import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CartService } from 'src/app/services/cart.service';
import { StorageService } from 'src/app/services/storage.service';
import { VoucherService } from 'src/app/services/voucher.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.less'],
})
export class CartComponent implements OnInit {
    cart;
    cartId;
    selectedProducts: any[] = [
        {
            totalItemPrice: 200,
            quantity: 2,
            stockAmount: 4,
            unitPrice: 100,
            listAttributeName: ['attribute1', 'attribute2'],
            name: 'Product 1',
            image: 'https://firebasestorage.googleapis.com/v0/b/advance-totem-350103.appspot.com/o/Fund%2Fnha-cho-cho-bang-go.jpg?alt=media&token=f7553df5-a21b-497b-a200-b88a48139439',
            isSelected: true,
        },
    ];
    isLogin: boolean = false;
    originalData: any;
    totalPrice: number = 0;
    discountPrice: number = 0;
    finalPrice: number = 0;
    listVoucher: any[] = [];
    constructor(
        private cartService: CartService,
        private storageService: StorageService,
        private router: Router,
        private cdr: ChangeDetectorRef,
        private voucherService: VoucherService
    ) {}

    ngOnInit(): void {
        this.isLogin = this.storageService.getDataFromCookie('jwtToken');
        if (this.isLogin) {
            this.getCart();
        } else {
            const cart = this.storageService.getItemLocal('cart');
            this.cartService.getUnauthCart(cart?.cartId).subscribe({
                next: (res) => {
                    this.storageService.setItemLocal('cart', res);
                    this.cart = res.cartItemList;
                    this.onSelectedItemsChange();
                },
            });
        }
        this.getVoucher();
    }

    getCart() {
        this.cartService.getCart().subscribe({
            next: (res) => {
                this.cart = res;
                this.calculateTotal();
                this.onSelectedItemsChange();
            },
            error: () => {
                this.cart = [
                    {
                        totalItemPrice: 200,
                        quantity: 2,
                        stockAmount: 4,
                        unitPrice: 100,
                        listAttributeName: ['attribute1', 'attribute2'],
                        name: 'Product 1',
                        image: 'https://firebasestorage.googleapis.com/v0/b/advance-totem-350103.appspot.com/o/Fund%2Fnha-cho-cho-bang-go.jpg?alt=media&token=f7553df5-a21b-497b-a200-b88a48139439',
                        isSelected: true,
                    },
                    {
                        totalItemPrice: 300,
                        quantity: 3,
                        stockAmount: 4,
                        unitPrice: 100,
                        listAttributeName: [
                            'attribute1',
                            'attribute2',
                            'attribute3',
                        ],
                        name: 'Product 2',
                        image: 'https://firebasestorage.googleapis.com/v0/b/advance-totem-350103.appspot.com/o/Fund%2Fnha-cho-cho-bang-go.jpg?alt=media&token=f7553df5-a21b-497b-a200-b88a48139439',
                        isSelected: false,
                    },
                ];
            },
        });
    }
    removeItem(data) {
        console.log(data);
        this.cartService.addToCart(-data.quantity, data.varietyId).subscribe({
            next: (res) => {
                this.getCart();
            },
        });
    }

    onCheckOut() {
        this.storageService.setItemLocal('cart', this.selectedProducts);
        this.router.navigate(['/user/check-out']);
    }

    onChangeQty(data, value) {
        if (data.stockAmount < data.quantity) {
            data.quantity = data.quantity;
        } else
            this.cartService
                .addToCart(value - data.quantity, data.varietyId)
                .subscribe({
                    next: () => {
                        this.getCart();
                    },
                    error(err) {},
                });
    }

    selectItem(item) {
        this.cartService.selectItem(item.cartItemId).subscribe({
            next: (res) => {},
        });
        this.calculateTotal();
        this.onSelectedItemsChange();
    }

    calculateTotal() {
        this.totalPrice = 0;
        this.cart.forEach((merchant) => {
            let totalSelectedPrice = 0;
            merchant.cartItemDTOList.forEach((item) => {
                if (item.isSelected) {
                    totalSelectedPrice += item.totalItemPrice;
                }
            });
            merchant.totalSelectedPrice = totalSelectedPrice;
            this.totalPrice += totalSelectedPrice;
            this.finalPrice = this.totalPrice;
        });
        console.log(this.cart);
    }

    onSelectedItemsChange() {
        this.selectedProducts = [];
        this.cart.forEach((merchant) => {
            merchant.cartItemDTOList.forEach((item) => {
                if (item.isSelected) {
                    this.selectedProducts.push(item);
                }
            });
        });
    }

    getVoucher() {
        this.voucherService.getVoucher().subscribe({
            next: (res) => {
                this.listVoucher = res;
            },
        });
    }
}
