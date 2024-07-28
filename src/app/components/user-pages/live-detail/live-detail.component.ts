import {
    BootstrapOptions,
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
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
import { StreamVideoComponent } from '../../shared/stream-video/stream-video.component';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import * as _ from 'lodash';
@Component({
    selector: 'app-live-detail',
    templateUrl: './live-detail.component.html',
    styleUrls: ['./live-detail.component.scss'],
})
export class LiveDetailComponent
    extends BaseComponent
    implements OnInit, OnDestroy
{
    @ViewChild('stream') streamVideo: StreamVideoComponent;
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
    sessionKey: string;
    OV: OpenVidu;
    session: Session;
    subscribers: StreamManager;
    isOnLive = false;
    listComment = [];
    commentContent;
    isEnd: boolean = false;
    liveCart = [];
    listAllProduct;
    currentStock = 0;
    firstPrice;
    stockAmount = 0;
    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private storageService: StorageService,
        private messageService: ToastMessageService,
        private streamService: StreamService,
        private router: Router
    ) {
        super();
    }
    ngOnDestroy(): void {
        this.leaveSession();
    }

    ngOnInit(): void {
        if (this.session) {
            this.leaveSession();
        }
        this.isLogin = !!this.getToken();
        this.sessionKey = window.location.href.slice(
            window.location.href.lastIndexOf('/') + 1
        );
        this.getAllProduct();
        this.publishStream(this.sessionKey);
    }

    leaveSession() {
        if (this.session) {
            this.session.disconnect();
        }
        this.subscribers = null;
        delete this.session;
        delete this.OV;
    }
    getAllProduct() {
        this.streamService.getLiveItems(this.sessionKey).subscribe({
            next: (res) => {
                this.listAllProduct = res;
                this.listProduct = this.parseProductList(res);
            },
        });
    }

    parseProductList(list) {
        const productMap = {};

        list.forEach((item) => {
            const productId = item.productId;
            if (!productMap[productId]) {
                productMap[productId] = {
                    productId: productId,
                    coverImage: item.coverImage,
                    livePrice: item.livePrice,
                    initialStock: item.initialStock,
                    currentStock: item.currentStock,
                    name: item.name,
                    items: [],
                };
            }
            productMap[productId].items.push(item);
        });

        return Object.values(productMap);
    }
    getLiveCart() {
        this.cartService.getLiveCart(this.sessionKey).subscribe({
            next: (res) => {
                this.liveCart = res;
            },
        });
    }
    onSelectProduct(product) {
        const userId = this.getUserInfo().userId;
        this.listDetailVariety = [];
        let listAtt = [];
        let listVar = product.items.map((item) => {
            return item.varietyId;
        });
        this.productService.getProduct(product.productId, userId).subscribe({
            next: (res) => {
                console.log(product);
                this.selectedProduct = res;
                this.selectedProduct.varieties.forEach((item) => {
                    if (listVar.includes(item.varietyId)) {
                        this.listDetailVariety.push({
                            ...item,
                            ...item.varietyAttributes,
                        });
                        listAtt.push(...item.varietyAttributes);
                    }
                });
                listAtt = _.uniqBy(listAtt, 'attributeId');
                this.listColor = [];
                this.listSize = [];
                (listAtt || []).forEach((item) => {
                    if (item.type === 'SIZE')
                        this.listSize.push({ ...item, active: true });
                    else this.listColor.push({ ...item, active: true });
                });
            },
        });
    }

    addToCart() {
        const liveItemId = this.listAllProduct.find(
            (item) => item.varietyId === this.selectedVariety.varietyId
        );
        const data = {
            quantity: this.numberOfProduct,
            totalItemPrice: this.attPrice,
            varietyId: this.selectedVariety.varietyId,
        };
        if (this.isLogin) {
            this.cartService
                .addToLiveCart(this.numberOfProduct, liveItemId.liveItemId)
                .subscribe({
                    next: (res) => {
                        if (res) {
                            this.getLiveCart();
                            (this.isSelectVariety = false),
                                this.messageService.showMessage(
                                    '',
                                    'Added to cart',
                                    'success'
                                );
                        } else {
                            this.messageService.showMessage(
                                '',
                                'Cannot add to cart',
                                'success'
                            );
                        }
                    },
                    error: () => {},
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
                    (item[1].attributeId === this.selectedSize.attributeId &&
                        item[0].attributeId ===
                            this.selectedColor.attributeId) ||
                    (item[0].attributeId === this.selectedSize.attributeId &&
                        item[1].attributeId === this.selectedColor.attributeId)
                );
            else if (this.selectedSize && !this.selectedColor)
                return (
                    item?.varietyAttributes[1]?.attributeId ===
                        this.selectedSize.attributeId ||
                    item?.varietyAttributes[0]?.attributeId ===
                        this.selectedSize.attributeId
                );
            else if (!this.selectedSize && this.selectedColor)
                return (
                    item.varietyAttributes[0].attributeId ===
                        this.selectedColor.attributeId ||
                    item.varietyAttributes[1].attributeId ===
                        this.selectedColor.attributeId
                );
            return false;
        });

        const liveItem = this.listAllProduct.find(
            (item) => item.varietyId === this.selectedVariety.varietyId
        );
        this.attPrice = liveItem.livePrice;
        this.firstPrice = liveItem.initialPrice;
        this.currentStock = liveItem.currentStock;
        this.stockAmount = liveItem.initialStock;
    }

    onChangeQty(event) {
        if (event > this.selectedVariety.stockAmount) {
            this.numberOfProduct = this.selectedVariety.stockAmount;
            this.isDisableBuy = true;
        } else {
            // this.attPrice = this.selectedVariety.price * event;
            this.numberOfProduct = event;
            this.isDisableBuy = false;
        }
    }

    async getStreamToken(id): Promise<string> {
        const token = await this.streamService.createToken(id);
        if (!token) {
            this.isEnd = true;
        }
        return token;
    }

    async publishStream(id) {
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();

        this.session.on('sessionDisconnected', (event) => {
            console.log('Stream destroyed: ' + event);
            this.streamVideo.endStream();
        });
        this.session.onParticipantJoined = (event) => {
            this.streamVideo.onParticipantChange(
                true,
                JSON.parse(event.metadata)
            );
        };

        this.session.onParticipantLeft = (event) => {
            console.log(event);
            this.streamVideo.onParticipantChange(
                false,
                'Participant left the session'
            );
        };
        this.session.on('streamCreated', (event: StreamEvent) => {
            let subscriber: Subscriber = this.session.subscribe(
                event.stream,
                undefined
            );

            this.subscribers = subscriber;
            this.isOnLive = true;
            this.streamVideo.playVideo();
            this.subscribers.on('videoElementCreated', (event) => {
                event.element.controls = true;
            });
        });

        this.session.on('exception', (exception) => {
            console.warn(exception);
        });
        this.session.on('signal', (event) => {
            const data = JSON.parse(event.data);
            const cmt = {
                userName: data.userFullName,
                userAvatar: data.userAvatar,
                content: data.content,
            };
            this.listComment.push(cmt);
            this.autoScrollToNewMessage();
        });
        const token = await this.getStreamToken(id);
        if (token)
            // const user = JSON.stringify(this.getUserInfo());
            this.session
                .connect(token, {})
                .then(() => {
                    // let publisher: Publisher = this.OV.initPublisher(undefined);
                    // this.session.publish(publisher);
                    this.streamVideo.onParticipantChange(true, 'You');
                    this.getLiveCart();
                })
                .catch((error) => {
                    console.log(
                        'There was an error connecting to the session:',
                        error.code,
                        error.message
                    );
                    this.messageService.showMessage(
                        '',
                        'Live has ended',
                        'error'
                    );
                });
    }

    onComment() {
        if (this.commentContent) {
            const info = this.getUserInfo();
            const { userAvatar, userFullName } = info;
            const data = {
                userAvatar,
                userFullName,
                content: this.commentContent,
            };
            this.session
                .signal({
                    data: JSON.stringify(data),
                    to: [],
                })
                .then(() => {
                    this.autoScrollToNewMessage();
                })
                .catch((error) => {
                    console.error(error);
                });
            this.commentContent = '';
        }
    }

    turnOffLive() {
        this.isOnLive = false;
        // this.session.forceUnpublish(
        //     this.subscribers.stream.streamManager.stream
        // );
    }

    autoScrollToNewMessage() {
        const cmtContent = document.getElementById('comments');
        cmtContent.scrollTop = cmtContent.scrollHeight;
    }

    checkout() {
        this.storageService.setItemLocal(
            'liveCartId',
            this.liveCart['liveCartId']
        );
        const data = this.liveCart['liveCartItemList'].map((item) => {
            return {
                name: item.liveItem.name,
                image: item.liveItem.coverImage,
                price: item.totalItemPrice,
                quantity: item.quantity,
            };
        });
        this.storageService.setItemLocal('cart', data);
        this.router.navigate(['/user/check-out']);
    }

    removeItem(data) {
        this.cartService
            .addToLiveCart(-data.quantity, data.liveItem.liveItemId)
            .subscribe({
                next: (res) => {
                    this.getLiveCart();
                },
            });
    }
}
