import { StorageService } from './services/storage.service';
import {
    Component,
    inject,
    Inject,
    Injector,
    OnDestroy,
    OnInit,
} from '@angular/core';
import { UserService } from './services/user.service';

@Component({
    selector: 'app-base',
    template: ` <p>base works!</p> `,
    styles: [],
})
export class BaseComponent {
    private userInfo;
    private userRole;
    private jwtToken;
    constructor() {}

    getUserInfo() {
        if (this.userInfo) return this.userInfo;
        return JSON.parse(localStorage.getItem('currentUser'));
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

    setRole(role) {
        this.userRole = role;
    }

    getRole() {
        if (!this.userRole) {
            const info = JSON.parse(localStorage.getItem('currentUser'));
            this.setRole(info.userRoles[0].roleName);
        }
        return this.userRole;
    }
}
