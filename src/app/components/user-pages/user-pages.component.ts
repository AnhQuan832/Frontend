import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-user-pages',
    templateUrl: './user-pages.component.html',
})
export class UserPageComponent {
    constructor(public layoutService: LayoutService, public router: Router) {}
}
