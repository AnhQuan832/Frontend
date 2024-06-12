import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
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

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss'],
})
export class LiveComponent extends BaseComponent implements OnInit, OnDestroy {
    @ViewChild('streamVideo', { static: false })
    streamVideo: StreamVideoComponent;
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
    constructor(
        private productService: ProductService,
        private streamService: StreamService,
        private messageService: ToastMessageService
    ) {
        super();
    }
    ngOnDestroy(): void {
        this.shutDownLive();
    }
    ngOnInit(): void {
        this.mySessionId = this.getUserInfo().merchantId;
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

    getProductForLive() {
        const info = this.getUserInfo();
        this.productService
            .getAllProduct({ merchantId: info.merchantId })
            .subscribe({
                next: (res) => {
                    this.listAllProduct = res;
                    this.listProductForLive = res.map((item) => ({
                        ...item,
                        isSelected: false,
                        isPinned: false,
                    }));
                    this.listProductForLive[0].isPinned = true;
                },
                error: (err) => {
                    console.log(err);
                },
            });
    }

    pinProduct(product) {}
    selectItem(item) {}

    publishStream() {
        this.isOnLive = true;
        this.isLoading = true;
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();

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

        this.session.on('reconnecting', () =>
            this.messageService.showMessage(
                '',
                'Oops! Trying to reconnect to the session',
                'error'
            )
        );
        this.session.on('reconnected', () =>
            this.messageService.showMessage(
                '',
                'Reconnected to the session',
                'success'
            )
        );
        this.session.on('sessionDisconnected', (event) => {
            if (event.reason === 'networkDisconnect') {
                this.messageService.showMessage(
                    '',
                    'You lost your connection to the session',
                    'error'
                );
            } else {
                // Disconnected from the session for other reason than a network drop
            }
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
            // this.streamVideo.onParticipantChange(
            //     true,
            //     JSON.parse(event.metadata)
            // );
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

        this.getStreamToken().then((token) => {
            this.session
                .connect(token, { clientData: '' })
                .then(() => {
                    let publisher: Publisher = this.OV.initPublisher(
                        undefined,
                        {
                            audioSource: undefined,
                            videoSource: undefined,
                            publishAudio: true,
                            publishVideo: true,
                            resolution: '640x480',
                            frameRate: 30,
                            insertMode: 'APPEND',
                            mirror: false,
                        }
                    );
                    this.session.publish(publisher);
                    this.mainStreamManager = publisher;
                    this.isLiveSuccess = true;
                    this.isLoading = false;
                })
                .catch((error) => {
                    console.log(
                        'There was an error connecting to the session:',
                        error.code,
                        error.message
                    );
                    this.isLoading = false;
                    this.messageService.showMessage(
                        '',
                        'Can not connect to Server. Please try again later!',
                        'error'
                    );
                });
        });
    }
    async getStreamToken(): Promise<string> {
        const sessionId = await this.streamService.createSession(
            this.createLiveData()
        );
        if (!sessionId) {
            this.messageService.showMessage(
                '',
                'Can not connect to Server. Please try again!',
                'error'
            );
        }
        return await this.streamService.createToken(sessionId, 'PUBLISHER');
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
        this.session.disconnect();
        this.session.unpublish(this.mainStreamManager[0]);
    }

    autoScrollToNewMessage() {
        const cmtContent = document.getElementById('comments');
        cmtContent.scrollTop = cmtContent.scrollHeight;
    }

    getProductDetail(product) {
        this.productService.getProductDetail(product.productId).subscribe({
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
        if (product.detail)
            product.detail.varieties.forEach((item) => {
                if (typeof item.price === 'number') item.price = value;
                else item.isSelected = value;
            });
        else {
            this.getProductDetail(product);
            setTimeout(() => {
                product.detail.varieties.forEach((item) => {
                    if (typeof item.price === 'number') item.price = value;
                    else item.isSelected = value;
                });
            }, 1000);
        }
    }

    getSelectedVariety() {
        let data = [];
        this.listAllProduct.forEach((item) => {
            if (item.isSelected)
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
        const imgInput = <HTMLImageElement>document.getElementById('coverImg');
        imgInput.src = URL.createObjectURL(this.coverImgFile[0]);
    }

    nextStep() {
        this.isSelectTitleLive = false;
    }
}
