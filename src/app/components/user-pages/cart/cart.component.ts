import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { CartService } from 'src/app/services/cart.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-cart',
    templateUrl: './cart.component.html',
    styleUrls: ['./cart.component.less'],
})
export class CartComponent implements OnInit {
    cart;
    cartId;
    selectedProducts: any[] = [];
    isLogin: boolean = false;
    originalData: any;
    constructor(
        private cartService: CartService,
        private storageService: StorageService,
        private router: Router,
        private cdr: ChangeDetectorRef
    ) {}

    ngOnInit(): void {
        this.isLogin = this.storageService.getDataFromCookie('jwtToken');
        if (this.isLogin) this.getCart();
        else {
            const cart = this.storageService.getItemLocal('cart');
            this.cartService.getUnauthCart(cart?.cartId).subscribe({
                next: (res) => {
                    this.storageService.setItemLocal('cart', res);
                    this.cart = res.cartItemList;
                    this.originalData = _.cloneDeep(res.cartItemList);
                    this.selectedProducts = this.originalData.filter(
                        (item) => item.isSelected
                    );
                },
            });
        }
    }

    getCart() {
        this.cartService.getCart().subscribe({
            next: (res) => {
                this.cart = res;
                this.originalData = _.cloneDeep(res);
                this.selectedProducts = this.originalData.filter(
                    (item) => item.isSelected
                );
            },
            error: () => console.log('error'),
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

    onGlobalFilter(cart: any, event: Event) {
        cart.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    onCheckOut() {
        this.storageService.setItemLocal('cart', this.selectedProducts);
        this.router.navigate(['/user/check-out']);
    }
    onChangeQty(data, value) {
        const current = this.originalData.find(
            (item) => item.cartItemId === data.cartItemId
        );
        if (current.stockAmount < data.quantity) {
            data.quantity = current.quantity;
            console.log(data.quantity);
        } else
            this.cartService
                .addToCart(data.quantity - current.quantity, data.varietyId)
                .subscribe({
                    next: () => {
                        this.getCart();
                    },
                    error(err) {},
                });
    }

    selectItem(item) {
        console.log(item);
        this.cartService.selectItem(item.cartItemId).subscribe({
            next: (res) => {},
        });
    }
}
