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
        return JSON.parse(sessionStorage.getItem('currentUser'));
    }

    setUserInfo(user) {
        this.userInfo = user;
    }

    setToken(token) {
        this.jwtToken = token;
    }

    getToken() {
        return this.jwtToken || this.getDataFromCookie('jwtToken');
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

    prepareFormData(formData, data, name, isObject = false) {
        if (isObject) {
            formData.append(
                name,
                new Blob([JSON.stringify(data)], { type: 'application/json' })
            );
        } else {
            if (Array.isArray(data)) {
                data.forEach((element) => {
                    formData.append(name, element.file);
                });
            } else formData.append(name, data);
        }
        // return formData;
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
}
