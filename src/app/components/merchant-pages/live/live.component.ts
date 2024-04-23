import { Component, OnInit } from '@angular/core';

@Component({
    selector: 'app-live',
    templateUrl: './live.component.html',
    styleUrls: ['./live.component.scss'],
})
export class LiveComponent implements OnInit {
    ngOnInit(): void {}

    getCamera() {
        let video = document.querySelector('#videoElement') as HTMLVideoElement;

        if (navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices
                .getUserMedia({ video: true })
                .then(function (stream) {
                    video.srcObject = stream;
                })
                .catch(function (err0r) {
                    console.log('Something went wrong!');
                });
        }
    }
}
