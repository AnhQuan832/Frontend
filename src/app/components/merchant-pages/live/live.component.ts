import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss'],
})
export class LiveComponent implements OnInit {
    ngOnInit(): void {
        this.setupCamera();
    }

    async setupCamera() {
        // Find the video element on our HTML page
        let video = document.getElementById('video') as HTMLVideoElement;

        // Request the front-facing camera of the device
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: false,
            video: {
                facingMode: 'user',
                height: { ideal: 1920 },
                width: { ideal: 1920 },
            },
        });
        video.srcObject = stream;
    }
}
