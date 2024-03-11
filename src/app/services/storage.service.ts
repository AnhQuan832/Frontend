import { HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class StorageService {
    constructor() {}

    setItemLocal(key: string, item: any) {
        localStorage.setItem(key, JSON.stringify(item));
    }

    getItemLocal(key: string) {
        const JSONItem = localStorage.getItem(key);
        if (!JSONItem) {
            return null;
        }
        return JSON.parse(JSONItem);
    }

    setTimeResetTokenCookie(key: string, value: any, expDays: number = 1) {
        let date = new Date();
        date.setTime(date.getTime() + expDays * 24 * 60 * 60 * 1000);
        const expires = 'expires=' + date.toUTCString();
        document.cookie = key + '=' + value + '; ' + expires + '; path=/';
    }

    getDataFromCookie(cName) {
        const name = cName + '=';
        const cDecoded = decodeURIComponent(document.cookie);
        const cArr = cDecoded.split('; ');
        let res;
        cArr.forEach((val) => {
            if (val.indexOf(name) === 0) res = val.substring(name.length);
        });
        return res;
    }
    getHttpHeader(): HttpHeaders {
        return new HttpHeaders({
            Authorization: `Bearer ${this.getDataFromCookie('jwtToken')}`,
        });
    }
}
