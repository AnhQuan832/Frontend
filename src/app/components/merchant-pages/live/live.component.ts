import {
    Component,
    HostListener,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { BaseComponent } from 'src/app/base.component';
import { ProductService } from 'src/app/services/product.service';
import { StreamService } from 'src/app/services/stream.service';
import {
    OpenVidu,
    Publisher,
    Session,
    StreamEvent,
    StreamManager,
    Subscriber,
} from 'openvidu-browser';
import { StreamVideoComponent } from '../../shared/stream-video/stream-video.component';
import { MenuItem } from 'primeng/api';
import { ToastMessageService } from 'src/app/services/toast-message.service';
import { eventTupleToStore, findElements } from '@fullcalendar/core/internal';
import { StorageService } from 'src/app/services/storage.service';
import { ComponentCanDeactivate } from './pending-change.guard';
import { Observable, windowCount } from 'rxjs';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss'],
})
export class LiveComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('streamVideo', { static: false })
    streamVideo: StreamVideoComponent;
    // @HostListener('window:beforeunload', ['$event'])
    // beforeunloadHandler($event: any) {
    //     console.log(window.event);
    //     localStorage.setItem('local', JSON.stringify(window.event));
    //     debugger;
    //     return false;
    // }
    listAllProduct = [];
    listProductForLive = [];
    isOnLive = false;
    cameraFound = false;
    mySessionId = '';
    OV: OpenVidu;
    session: Session;
    mainStreamManager: StreamManager;
    items: MenuItem[];
    selectedProduct = null;
    indexSelectedProduct = 0;
    isLiveSuccess: boolean = false;
    listComment = [];
    price = 200000000;
    coverImgFile: FileList;
    isSelectTitleLive = true;
    liveTitle;
    isLoading: boolean = false;
    first = 1;
    totalRecords = 1;
    listLiveProduct = [];
    isRefresh = false;
    constructor(
        private productService: ProductService,
        private streamService: StreamService,
        private messageService: ToastMessageService,
        private storageService: StorageService
    ) {
        super();
        const liveSession = this.getDataFromCookie('sessionToken');
        if (liveSession) {
            this.publishStream(liveSession);
        }
    }
    ngOnDestroy(): void {
        this.shutDownLive();
        // this.setTempSession();
    }
    ngOnInit(): void {
        this.getProductForLive();
        this.items = [
            {
                label: 'Highlight',
                command: () => {
                    this.listProductForLive.splice(
                        this.indexSelectedProduct,
                        1
                    );
                    this.removeHighlight(this.listProductForLive);
                    this.selectedProduct.isPinned = true;
                    this.listProductForLive.unshift(this.selectedProduct);
                },
            },
            {
                label: 'Remove',
                command: () => {
                    this.listProductForLive.splice(
                        this.indexSelectedProduct,
                        1
                    );
                },
            },
        ];
    }

    async selectExit() {
        return new Promise((resolve, reject) => {
            resolve(true);
        });
    }

    setTempSession() {
        this.storageService.setTimeResetTokenCookie(
            'sessionToken',
            this.mySessionId,
            0.00011
        );
    }
    getProductForLive() {
        const info = this.getUserInfo();
        this.productService
            .getAllProduct({
                merchantId: info.merchantId,
                page: this.first,
                size: 50,
            })
            .subscribe({
                next: (res) => {
                    this.listAllProduct = res;
                    this.listProductForLive = res.map((item) => ({
                        ...item,
                        isSelected: false,
                        isPinned: false,
                    }));
                    this.listProductForLive[0].isPinned = true;
                    this.totalRecords = this.listAllProduct[0].totalRecord || 0;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    pinProduct(product) {}
    selectItem(item) {}

    async publishStream(prevSession?) {
        this.isOnLive = true;
        this.isLoading = true;
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();
        this.OV.setAdvancedConfiguration({
            iceServers: [
                {
                    urls: 'turns:global.relay.metered.ca:443',
                    username: 'e5501e082a3b3e2c71bbd3e8',
                    credential: 'a9RtoZ3qOO7qa8+/',
                },
            ],
        });

        this.session.on('exception', (event) => {
            if (event.name === 'ICE_CONNECTION_FAILED') {
                var stream = event.origin;
                console.warn('Stream ' + stream + ' broke!');
                console.warn('Reconnection process automatically started');
                this.messageService.showMessage('', 'Disconnected', 'error');
            }
            if (event.name === 'ICE_CONNECTION_DISCONNECTED') {
                var stream = event.origin;
                console.warn('Stream ' + stream + ' disconnected!');
                console.warn(
                    'Giving it some time to be restored. If not possible, reconnection process will start'
                );
                this.messageService.showMessage('', 'Disconnected', 'error');
            }
        });

        // this.session.on('reconnecting', () =>
        //     this.messageService.showMessage(
        //         '',
        //         'Oops! Trying to reconnect to the session',
        //         'error'
        //     )
        // );
        // this.session.on('reconnected', () =>
        //     this.messageService.showMessage(
        //         '',
        //         'Reconnected to the session',
        //         'success'
        //     )
        // );
        this.session.on('sessionDisconnected', (event) => {
            if (event.reason === 'networkDisconnect') {
            } else {
                // Disconnected from the session for other reason than a network drop
            }
            this.messageService.showMessage(
                '',
                'Your live has been shut down',
                'error'
            );
            this.isLiveSuccess = false;
            this.isSelectTitleLive = true;
        });

        this.session.onParticipantJoined = (event) => {
            console.log(event);
            this.messageService.showMessage(
                '',
                'New participant joined',
                'info'
            );
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

        this.getStreamToken(prevSession).then((token) => {
            this.connectToSession(token);
        });
    }

    connectToSession(token) {
        this.session
            .connect(token, { clientData: '' })
            .then(() => {
                let publisher: Publisher = this.OV.initPublisher(undefined, {
                    audioSource: undefined,
                    videoSource: undefined,
                    publishAudio: true,
                    publishVideo: true,
                    resolution: '640x480',
                    frameRate: 30,
                    insertMode: 'APPEND',
                    mirror: false,
                });
                this.session.publish(publisher);
                this.mainStreamManager = publisher;
                this.isLiveSuccess = true;
                this.isLoading = false;
                this.isSelectTitleLive = false;
            })
            .catch((error) => {
                console.log(
                    'There was an error connecting to the session:',
                    error.code,
                    error.message
                );
                this.isLoading = false;
            });
    }

    async getStreamToken(prevSession?): Promise<string> {
        this.mySessionId =
            prevSession ||
            (await this.streamService.createSession(
                this.createLiveData()
                // 'MERCHANT_1'
            ));
        if (!this.mySessionId) {
            this.messageService.showMessage(
                '',
                'Can not connect to Server. Please try again!',
                'error'
            );
        }
        this.setTempSession();

        // return await this.streamService.createToken(
        //     this.mySessionId,
        //     'PUBLISHER'
        // );
        return await this.streamService.createToken(this.mySessionId);
    }

    removeHighlight(products, index?) {
        if (index) {
            products[index].isPinned = false;
        } else {
            products.forEach((product) => {
                product.isPinned = false;
            });
        }
    }

    shutDownLive() {
        this.isLiveSuccess = false;
        this.streamService.suspendSession(this.mySessionId);
        // this.session.disconnect();
        // this.session.unpublish(this.mainStreamManager[0]);
    }

    autoScrollToNewMessage() {
        const cmtContent = document.getElementById('comments');
        cmtContent.scrollTop = cmtContent.scrollHeight;
    }

    getProductDetail(product) {
        this.productService
            .getProduct(product.productId, this.getUserInfo().userId)
            .subscribe({
                next: (res) => {
                    product['detail'] = res;
                    product.detail['listColor'] = [];
                    product.detail['listSize'] = [];
                    product.isSelected = true;
                    (product.detail?.varieties || []).forEach((item) => {
                        // if (item.type === 'SIZE')
                        //     product.detail['listColor'].push({
                        //         ...item,
                        //         active: true,
                        //     });
                        // else
                        //     product.detail['listSize'].push({
                        //         ...item,
                        //         active: true,
                        //     });
                        item['liveStock'] = item.stockAmount;
                        item['isSelected'] = true;
                        item['livePrice'] = item.price;
                    });
                },
            });
    }

    showProductDetail(product) {
        // product['isSelected'] = !product['isSelected'];
        if (!product.detail) this.getProductDetail(product);
    }

    onChangeQty(vari, value) {
        vari.liveStock = value;
    }

    editWholeVariety(product, value) {
        if (product.detail?.varieties?.length)
            product.detail.varieties.forEach((item) => {
                if (typeof value === 'number') item.livePrice = value;
                else item.isSelected = value;
            });
        else {
            this.getProductDetail(product);
            setTimeout(() => {
                product.detail.varieties.forEach((item) => {
                    if (typeof value === 'number') item.livePrice = value;
                    else item.isSelected = value;
                });
            }, 1000);
        }
    }

    getSelectedVariety() {
        let data = [];
        this.listLiveProduct = [];
        this.listAllProduct.forEach((item) => {
            if (item.isSelected) {
                this.listLiveProduct.push(item);
                item.detail.varieties.forEach((variety) => {
                    if (variety.isSelected) {
                        const varietyData = {
                            livePrice: variety.livePrice,
                            liveStock: variety.liveStock,
                            varietyId: variety.varietyId,
                        };
                        data.push(varietyData);
                    }
                });
            }
        });
        return data;
    }
    createLiveData() {
        const formData = new FormData();
        const data = this.getSelectedVariety();
        const request = {
            liveSessionTitle: this.liveTitle,
            liveItemList: data,
        };
        this.prepareFormData(formData, request, 'request', true);

        this.prepareFormData(
            formData,
            this.coverImgFile[0],
            'thumbnail',
            false
        );

        console.log(formData.get('request'));
        return formData;
    }

    onSelectCoverImg(event: any) {
        this.coverImgFile = event.target.files;
        // if (this.coverImgFile[0].size > 1048576) {
        //     this.messageService.showMessage(
        //         '',
        //         'Image size must be less than 1MB',
        //         'error'
        //     );
        //     return;
        // }
        const imgInput = <HTMLImageElement>document.getElementById('coverImg');
        imgInput.src = URL.createObjectURL(this.coverImgFile[0]);
    }

    nextStep() {
        this.isSelectTitleLive = false;
    }

    onPageChange(event) {
        console.log(event);
    }
}
