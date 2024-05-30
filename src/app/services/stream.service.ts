import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { StorageService } from './storage.service';

@Injectable({
    providedIn: 'root',
})
export class StreamService {
    APPLICATION_SERVER_URL = 'http://localhost:5000/';
    constructor(
        private http: HttpClient,
        private storageService: StorageService
    ) {}

    createSession(sessionId) {
        return this.http
            .post(
                this.APPLICATION_SERVER_URL + 'api/sessions',
                { customSessionId: sessionId },
                {
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'text',
                }
            )
            .toPromise();
    }

    createToken(sessionId) {
        return this.http
            .post(
                this.APPLICATION_SERVER_URL +
                    'api/sessions/' +
                    sessionId +
                    '/connections',
                {},
                {
                    headers: { 'Content-Type': 'application/json' },
                    responseType: 'text',
                }
            )
            .toPromise();
    }
}
