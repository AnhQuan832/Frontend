import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-user-pages',
    templateUrl: './user-pages.component.html',
    styles: [
        `
            :host {
                height: 100vh !important;
                display: flex;
                flex-direction: column;
                justify-content: space-between;
            }
        `,
    ],
})
export class UserPageComponent {
    constructor(public layoutService: LayoutService, public router: Router) {}
}
