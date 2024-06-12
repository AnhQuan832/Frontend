import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';
import { lastValueFrom, map } from 'rxjs';
import { API } from '../constant/enum';

@Injectable({
    providedIn: 'root',
})
export class StreamService {
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    APPLICATION_SERVER_URL = 'http://localhost:5000/';

    createSession(formData: FormData) {
        return this.http
            .post(API.LIVE.END_POINT.SESSION, formData, {
                headers: this.storageService.getHttpHeader(),
            })
            .toPromise();
    }

    createToken(sessionId) {
        return lastValueFrom(
            this.http.post(
                API.LIVE.END_POINT.SESSION + `${sessionId + '/connections'}`,
                {},
                {
                    headers: this.storageService.getHttpHeader(),
                    responseType: 'text',
                }
            )
        );
    }

    suspendSession(sessionId) {
        return lastValueFrom(
            this.http.post(
                API.LIVE.END_POINT.SESSION + `${sessionId + '/end'}`,
                {},
                {
                    headers: this.storageService.getHttpHeader(),
                    responseType: 'text',
                }
            )
        );
    }

    // createSession(sessionId) {
    //     return this.http
    //         .post(
    //             this.APPLICATION_SERVER_URL + 'api/sessions',
    //             { customSessionId: sessionId },
    //             {
    //                 headers: { 'Content-Type': 'application/json' },
    //                 responseType: 'text',
    //             }
    //         )
    //         .toPromise();
    // }

    // createToken(sessionId) {
    //     return this.http
    //         .post(
    //             this.APPLICATION_SERVER_URL +
    //                 'api/sessions/' +
    //                 sessionId +
    //                 '/connections',
    //             {},
    //             {
    //                 headers: { 'Content-Type': 'application/json' },
    //                 responseType: 'text',
    //             }
    //         )
    //         .toPromise();
    // }
}
