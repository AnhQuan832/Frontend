import { Component, OnInit, ViewChild } from '@angular/core';
import {
    OpenVidu,
    Session,
    StreamEvent,
    StreamManager,
    Subscriber,
} from 'openvidu-browser';
import {
    DialogService,
    DynamicDialogConfig,
    DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { BaseComponent } from 'src/app/base.component';
import { StreamVideoComponent } from 'src/app/components/shared/stream-video/stream-video.component';
import { StreamService } from 'src/app/services/stream.service';
import { ToastMessageService } from 'src/app/services/toast-message.service';

@Component({
    selector: 'app-quickview-live',
    templateUrl: './quickview-live.component.html',
    styleUrls: ['./quickview-live.component.scss'],
})
export class QuickviewLiveComponent extends BaseComponent implements OnInit {
    @ViewChild('stream') streamVideo: StreamVideoComponent;

    sessionKey: string;
    OV: OpenVidu;
    session: Session;
    subscribers: StreamManager;

    constructor(
        private streamService: StreamService,
        private config: DynamicDialogConfig,
        private messageService: ToastMessageService,
        private ref: DynamicDialogRef
    ) {
        super();
        this.sessionKey = this.config.data.sessionKey;
    }
    ngOnInit(): void {
        this.publishStream(this.sessionKey);
    }

    async publishStream(id) {
        this.OV = new OpenVidu();

        this.session = this.OV.initSession();

        this.session.on('streamDestroyed', (event: StreamEvent) => {
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
            this.streamVideo.playVideo();
            this.subscribers.on('videoElementCreated', (event) => {
                event.element.controls = true;
            });
        });

        this.session.on('exception', (exception) => {
            console.warn(exception);
        });
        // this.session.on('signal', (event) => {
        //     const data = JSON.parse(event.data);
        //     const cmt = {
        //         userName: data.userFullName,
        //         userAvatar: data.userAvatar,
        //         content: data.content,
        //     };
        //     this.listComment.push(cmt);
        //     this.autoScrollToNewMessage();
        // });
        const token = await this.getStreamToken(id);
        if (token)
            // const user = JSON.stringify(this.getUserInfo());
            this.session
                .connect(token, {})
                .then(() => {
                    // let publisher: Publisher = this.OV.initPublisher(undefined);
                    // this.session.publish(publisher);
                    this.streamVideo.onParticipantChange(true, 'You');
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
        else {
            this.messageService.showMessage('', 'Live has ended', 'error');
            setTimeout(() => {
                this.ref.close();
            }, 1000);
        }
    }

    async getStreamToken(id): Promise<string> {
        const token = await this.streamService.createToken(id);
        return token;
    }

    shutDownLive() {
        this.streamService.suspendSession(this.sessionKey);
        setTimeout(() => {
            this.ref.close();
        }, 1000);
        // this.session.disconnect();
        // this.session.unpublish(this.mainStreamManager[0]);
    }
}
