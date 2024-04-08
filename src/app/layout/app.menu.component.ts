import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { BaseComponent } from '../base.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent extends BaseComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: LayoutService) {
        super();
    }

    ngOnInit() {
        this.model = [
            {
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/merchant'],
                    },
                ],
            },
            {
                items: [
                    {
                        label: 'Product',
                        icon: 'pi pi-fw pi-box',
                        routerLink: ['/merchant/product'],
                    },
                    {
                        label: 'Order',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/merchant/order'],
                    },
                    {
                        label: 'Voucher',
                        icon: 'pi pi-fw pi-ticket',
                        routerLink: ['/merchant/voucher'],
                    },
                    {
                        label: 'Live',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/merchant/live'],
                    },
                    {
                        label: 'Message',
                        icon: 'pi pi-fw pi-comment',
                        routerLink: ['/merchant/message'],
                    },
                    {
                        label: 'Statistic',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/merchant/sale'],
                    },
                    {
                        label: 'Log out',
                        icon: 'pi pi-fw pi-sign-in',
                        routerLink: ['/auth/login'],
                    },
                ],
            },
        ];
    }
}
