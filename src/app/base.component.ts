import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-base',
    template: ` <p>base works!</p> `,
    styles: [],
})
export class BaseComponent {
    private userInfo;
    private jwtToken;
    constructor() {}

    getUserInfo() {
        return this.userInfo;
    }

    setUserInfo(user) {
        this.userInfo = user;
    }

    setToken(token) {
        this.jwtToken = token;
    }

    getToken() {
        return this.jwtToken;
    }
}
