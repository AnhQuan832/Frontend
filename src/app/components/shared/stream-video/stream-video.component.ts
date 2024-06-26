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
    signal,
    computed,
    ChangeDetectorRef,
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
    @ViewChild('videoElement', { static: false }) elementRef: ElementRef;
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
    @Input() isEnd: boolean = false;

    mySessionId = '';
    OV: OpenVidu;
    _streamManager;
    listComment = [];
    commentContent;
    viewers: number = 0;
    constructor(
        private streamService: StreamService,
        public layoutService: LayoutService,
        private cdr: ChangeDetectorRef
    ) {
        super();
    }
    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['session'] && this.session) {
        //     this.session.on('signal', (event) => {
        //         const data = JSON.parse(event.data);
        //         const cmt = {
        //             userName: data.userFullName,
        //             userAvatar: data.userAvatar,
        //             content: data.content,
        //         };
        //         this.listComment.push(cmt);
        //         this.autoScrollToNewMessage();
        //     });
        // }
    }

    ngAfterViewInit() {
        if (this._streamManager) {
            this._streamManager.addVideoElement(this.elementRef.nativeElement);
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

    onParticipantChange(isJoin = true, info?) {
        if (isJoin) this.viewers++;
        else if (this.viewers > 0) this.viewers--;
    }

    playVideo() {
        const video = document.querySelector('video') as HTMLMediaElement;
        video.play();
        video.muted = false;
        setTimeout(() => {
            video.muted = false;
        }, 10000);
    }

    endStream() {
        this.isEnd = true;
        this.cdr.detectChanges();
    }

    getVideoElement() {
        return this.elementRef.nativeElement;
    }
}
