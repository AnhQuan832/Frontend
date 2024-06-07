import { Component, OnInit, ViewChild } from '@angular/core';
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

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss'],
})
export class LiveComponent extends BaseComponent implements OnInit {
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
    constructor(
        private productService: ProductService,
        private streamService: StreamService
    ) {
        super();
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
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();

        this.session.on('exception', (exception) => {
            console.warn(exception);
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
                })
                .catch((error) => {
                    console.log(
                        'There was an error connecting to the session:',
                        error.code,
                        error.message
                    );
                });
        });
    }
    async getStreamToken(id?): Promise<string> {
        const sessionId = await this.streamService.createSession(
            this.mySessionId
        );
        return await this.streamService.createToken(sessionId);
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
        this.isOnLive = false;
        this.session.disconnect();
        this.session.unpublish(this.mainStreamManager[0]);
    }
}
