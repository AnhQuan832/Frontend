import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'product',
                loadChildren: () =>
                    import('./product/product.module').then(
                        (m) => m.ProductModule
                    ),
            },
            {
                path: 'order',
                loadChildren: () =>
                    import('./order/order.module').then((m) => m.OrderModule),
            },
            {
                path: 'voucher',
                loadChildren: () =>
                    import(
                        './voucher-management/voucher-management.module'
                    ).then((m) => m.VoucherManagementModule),
            },
            {
                path: 'message',
                loadChildren: () =>
                    import('./chat/chat.module').then((m) => m.ChatModule),
            },
            {
                path: 'sale',
                loadChildren: () =>
                    import('./sale/sale.module').then((m) => m.SaleModule),
            },
            {
                path: 'live',
                loadChildren: () =>
                    import('./live/live.module').then((m) => m.LiveModule),
            },
            {
                path: 'merchant',
                loadChildren: () =>
                    import('./merchant/merchant.module').then(
                        (m) => m.MerchantModule
                    ),
            },
            {
                path: 'admin-live',
                loadChildren: () =>
                    import('./admin-live/admin-live.module').then(
                        (m) => m.AdminLiveModule
                    ),
            },
            { path: '**', redirectTo: '/notfound' },
        ]),
    ],
    exports: [RouterModule],
})
export class PagesRoutingModule {}
