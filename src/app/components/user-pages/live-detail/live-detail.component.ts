import { BootstrapOptions, Component, OnInit } from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-live-detail',
    templateUrl: './live-detail.component.html',
    styleUrls: ['./live-detail.component.scss'],
})
export class LiveDetailComponent extends BaseComponent implements OnInit {
    listProduct = [];
    isLogin: boolean;
    numberOfProduct = 0;
    attPrice = 0;
    listDetailVariety: any[] = [];
    selectedVariety;
    isSelectVariety: boolean = false;
    selectedProduct;
    listSize: any = [];
    listColor: any = [];
    selectedColor: any;
    selectedSize: any;
    isDisableBuy: boolean = true;
    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private storageService: StorageService,
        private messageService: ToastMessageService
    ) {
        super();
    }

    ngOnInit(): void {
        this.getAllProduct();
        this.isLogin = !!this.getToken();
    }

    getAllProduct() {
        this.productService.getAllProduct().subscribe({
            next: (res) => {
                this.listProduct = res;
            },
            error: (err) => {
                console.log(err);
            },
        });
    }

    onSelectProduct(product) {
        this.productService.getProductDetail(product.productId).subscribe({
            next: (res) => {
                this.selectedProduct = res;
                this.selectedProduct.varieties.forEach((item) => {
                    this.listDetailVariety.push({
                        ...item,
                        ...item.varietyAttributes,
                    });
                });
                this.listColor = [];
                this.listSize = [];
                (this.selectedProduct.varietyAttributeList || []).forEach(
                    (item) => {
                        if (item.type === 'SIZE')
                            this.listSize.push({ ...item, active: true });
                        else this.listColor.push({ ...item, active: true });
                    }
                );
            },
        });
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
                    next: (res) => {
                        (this.isSelectVariety = false),
                            this.messageService.showMessage(
                                '',
                                'Added to cart',
                                'success'
                            );
                    },
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
                    item[1].attributeId === this.selectedSize.attributeId &&
                    item[0].attributeId === this.selectedColor.attributeId
                );
            else if (this.selectedSize && !this.selectedColor)
                return (
                    item?.varietyAttributes[1]?.attributeId ===
                    this.selectedSize.attributeId
                );
            else if (!this.selectedSize && this.selectedColor)
                return (
                    item.varietyAttributes[0].attributeId ===
                    this.selectedColor.attributeId
                );
            return false;
        });
        this.attPrice = this.selectedVariety
            ? this.selectedVariety.price
            : this.selectedProduct.price;
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
}
