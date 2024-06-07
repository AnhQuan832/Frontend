import { BootstrapOptions, Component, OnInit } from '@angular/core';
import {
    OpenVidu,
    Publisher,
    Session,
    StreamEvent,
    StreamManager,
    Subscriber,
} from 'openvidu-browser';
import { BaseComponent } from 'src/app/base.component';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';
import { StorageService } from 'src/app/services/storage.service';
import { StreamService } from 'src/app/services/stream.service';
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
    stream: StreamManager;
    merchantId: string;
    OV: OpenVidu;
    session: Session;
    subscribers: StreamManager;
    isOnLive = false;
    listComment = [];
    commentContent;
    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private storageService: StorageService,
        private messageService: ToastMessageService,
        private streamService: StreamService
    ) {
        super();
    }

    ngOnInit(): void {
        this.listComment = [
            {
                userName: 'user1',
                content: 'comment 1',
            },
            {
                userName: 'user2',
                content: 'comment 2',
            },
            {
                userName: 'user3',
                content: 'comment 3',
            },
        ];
        this.getAllProduct();
        this.isLogin = !!this.getToken();
        this.merchantId = window.location.href.slice(
            window.location.href.lastIndexOf('/') + 1
        );
        this.publishStream(this.merchantId);
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

    async getStreamToken(id): Promise<string> {
        const sessionId = await this.streamService.createSession(id);
        return await this.streamService.createToken(sessionId);
    }

    publishStream(id) {
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();

        this.session.on('streamDestroyed', (event: StreamEvent) => {
            console.log('Stream destroyed: ' + event);
        });

        this.session.on('streamCreated', (event: StreamEvent) => {
            let subscriber: Subscriber = this.session.subscribe(
                event.stream,
                undefined
            );

            this.subscribers = subscriber;
            this.isOnLive = true;
        });

        this.session.on('exception', (exception) => {
            console.warn(exception);
        });
        this.getStreamToken(id).then((token) => {
            console.log(token);
            this.session
                .connect(token, { clientData: '' })
                .then(() => {
                    let publisher: Publisher = this.OV.initPublisher(
                        undefined,
                        {}
                    );
                    this.session.publish(publisher);
                })
                .catch((error) => {
                    console.log(
                        'There was an error connecting to the session:',
                        error.code,
                        error.message
                    );
                });
            this.session.on('signal', (event) => {
                console.log(event.data); // Message
                console.log(event.from); // Connection object of the sender
                console.log(event.type); // The type of message
            });
        });
    }

    onComment() {
        this.session
            .signal({
                data: this.commentContent, // Any string (optional)
                to: [], // Array of Connection objects (optional. Broadcast to everyone if empty)
            })
            .then(() => {
                console.log('Message successfully sent');
            })
            .catch((error) => {
                console.error(error);
            });
    }

    turnOffLive() {
        this.isOnLive = false;
        this.session.forceUnpublish(
            this.subscribers.stream.streamManager.stream
        );
    }
}
