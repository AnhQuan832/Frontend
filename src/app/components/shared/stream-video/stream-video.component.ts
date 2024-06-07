import { query } from '@angular/animations';
import {
    AfterViewInit,
    Component,
    ElementRef,
    Input,
    OnInit,
    Output,
    ViewChild,
    EventEmitter,
    OnChanges,
    SimpleChange,
    SimpleChanges,
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
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { StreamService } from 'src/app/services/stream.service';

@Component({
    selector: 'app-stream-video',
    templateUrl: './stream-video.component.html',
    styleUrls: ['./stream-video.component.scss'],
})
export class StreamVideoComponent
    extends BaseComponent
    implements OnChanges, AfterViewInit
{
    @ViewChild('videoElement') elementRef: ElementRef;
    @Input()
    set streamManager(streamManager: StreamManager) {
        this._streamManager = streamManager;
        if (!!this.elementRef) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
        }
    }
    @Input() subscriber: StreamManager;
    @Input() isPublisher: boolean = false;
    @Input() session: Session;
    @Output() onStreamManager = new EventEmitter<any>();

    mySessionId = '';
    OV: OpenVidu;
    _streamManager;
    listComment = [];
    commentContent;
    constructor(
        private streamService: StreamService,
        public layoutService: LayoutService
    ) {
        super();
    }
    ngOnChanges(changes: SimpleChanges): void {
        if (changes['session'] && this.session) {
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
        }
    }

    ngAfterViewInit() {
        if (this._streamManager) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
        } else {
            let video = document.getElementById(
                '#videoElement'
            ) as HTMLVideoElement;

            if (navigator.mediaDevices.getUserMedia) {
                navigator.mediaDevices
                    .getUserMedia({ video: true })
                    .then(function (stream) {
                        video.srcObject = stream;
                    })
                    .catch(function (error) {
                        console.log('Something went wrong!');
                    });
            }
        }
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

    autoScrollToNewMessage() {
        const cmtContent = document.getElementById('comments');
        cmtContent.scrollTop = cmtContent.scrollHeight;
    }
}
