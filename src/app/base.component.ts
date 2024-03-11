import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
    selector: 'app-base',
    template: ` <p>base works!</p> `,
    styles: [],
})
export class BaseComponent {
    constructor() {
        console.log('Base compoent');
    }
}
