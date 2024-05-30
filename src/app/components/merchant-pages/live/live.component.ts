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
    constructor(
        private productService: ProductService,
        private streamService: StreamService
    ) {
        super();
    }
    ngOnInit(): void {
        this.mySessionId = this.getUserInfo().merchantId;
        this.getProductForLive();
    }

    getProductForLive() {
        const info = this.getUserInfo();
        this.productService
            .getAllProduct({ merchantId: info.merchantId })
            .subscribe({
                next: (res) => {
                    this.listAllProduct = res;
                    this.listProductForLive = res;
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
}
