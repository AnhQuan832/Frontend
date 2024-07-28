import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { BaseComponent } from '../base.component';
import { MerchantService } from '../services/merchant.service';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent extends BaseComponent implements OnInit {
    model: any[] = [];

    constructor(
        public layoutService: LayoutService,
        private merchantService: MerchantService
    ) {
        super();
    }

    ngOnInit() {
        if (this.getRole() === 'ROLE_MERCHANT') {
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
                            label: 'List Order',
                            icon: 'pi pi-fw pi-shopping-cart',
                            routerLink: ['/merchant/order'],
                            items: [
                                {
                                    label: 'Order',
                                    icon: 'pi pi-fw pi-shopping-cart',
                                    routerLink: ['/merchant/order'],
                                },
                                {
                                    label: 'Live Order',
                                    icon: 'pi pi-fw pi-shopping-bag',
                                    routerLink: ['/merchant/order/live-order'],
                                },
                            ],
                        },
                        {
                            label: 'Live',
                            icon: 'pi pi-fw pi-eye',
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
                    ],
                },
            ];
            this.merchantService
                .getMerchantDetail(this.getUserInfo().merchantId)
                .subscribe((res) => {
                    if (!res.isLiveable)
                        this.model[1].items = this.model[1].items.filter(
                            (item) => item.label !== 'Live'
                        );
                });
        } else
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
                            label: 'Voucher',
                            icon: 'pi pi-fw pi-ticket',
                            routerLink: ['/merchant/voucher'],
                        },
                        {
                            label: 'Live',
                            icon: 'pi pi-fw pi-eye',
                            routerLink: ['/merchant/admin-live'],
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
                            label: 'Merchant',
                            icon: 'pi pi-fw pi-users',
                            routerLink: ['/merchant/merchant'],
                            items: [
                                {
                                    label: 'Manage',
                                    icon: 'pi pi-fw pi-user-edit',
                                    routerLink: ['/merchant/merchant'],
                                },
                                {
                                    label: 'Merchant Request',
                                    icon: 'pi pi-fw pi-user-plus',
                                    routerLink: ['/merchant/merchant/request'],
                                },
                            ],
                        },
                    ],
                },
            ];
    }
}
