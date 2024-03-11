import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    model: any[] = [];

    constructor(public layoutService: LayoutService) {}

    ngOnInit() {
        this.model = [
            {
                items: [
                    {
                        label: 'Dashboard',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/'],
                    },
                ],
            },
            {
                items: [
                    {
                        label: 'Product',
                        icon: 'pi pi-fw pi-box',
                        items: [
                            {
                                label: 'Manage',
                                icon: 'pi pi-fw pi-box',
                                routerLink: ['/pages/product'],
                            },
                            {
                                label: 'Import',
                                icon: 'pi pi-fw pi-download',
                                routerLink: ['/pages/product/import'],
                            },
                        ],
                    },
                    {
                        label: 'Order',
                        icon: 'pi pi-fw pi-shopping-cart',
                        routerLink: ['/pages/order'],
                    },
                    {
                        label: 'Voucher',
                        icon: 'pi pi-fw pi-ticket',
                        routerLink: ['/pages/voucher'],
                    },
                    {
                        label: 'Statistic',
                        icon: 'pi pi-fw pi-chart-line',
                        routerLink: ['/pages/sale'],
                    },
                    {
                        label: 'Message',
                        icon: 'pi pi-fw pi-comment',
                        routerLink: ['/pages/message'],
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
