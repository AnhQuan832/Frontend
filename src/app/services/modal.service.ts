import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    constructor() {}

    isLarge() {
        return window.innerWidth > 991;
    }

    isMedium() {
        return window.innerWidth < 991 && window.innerWidth > 667;
    }

    isSmall() {
        return window.innerWidth < 667;
    }
}
