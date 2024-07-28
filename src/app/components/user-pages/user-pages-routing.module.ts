import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserPageComponent } from './user-pages.component';
import { CartComponent } from './cart/cart.component';
import { ChatComponent } from './chat/chat.component';
import { CheckOutComponent } from './check-out/check-out.component';
import { CompleteCheckoutComponent } from './complete-checkout/complete-checkout.component';
import { InvoiceHistoryComponent } from './invoice-history/invoice-history.component';
import { HomeComponent } from './landing/landing.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ShopViewComponent } from './shop-view/shop-view.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { LiveDetailComponent } from './live-detail/live-detail.component';
import { MerchantShopComponent } from './merchant-shop/merchant-shop.component';
import { PurchaseHistoryComponent } from './purchase-history/purchase-history.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                redirectTo: '/user/home',
                pathMatch: 'full',
            },
            {
                path: '',
                component: UserPageComponent,
                children: [
                    {
                        path: 'home',
                        component: HomeComponent,
                    },
                    {
                        path: 'shop',
                        component: ShopViewComponent,
                    },
                    {
                        path: 'product-detail/:id',
                        component: ProductDetailComponent,
                    },
                    {
                        path: 'cart',
                        component: CartComponent,
                    },
                    {
                        path: 'profile',
                        component: UserProfileComponent,
                    },
                    {
                        path: 'check-out',
                        component: CheckOutComponent,
                    },
                    {
                        path: 'message',
                        component: ChatComponent,
                    },
                    {
                        path: 'invoice-history',
                        component: InvoiceHistoryComponent,
                    },
                    {
                        path: 'complete-checkout',
                        component: CompleteCheckoutComponent,
                    },
                    {
                        path: 'live/:id',
                        component: LiveDetailComponent,
                    },
                    {
                        path: 'shop/:id',
                        component: MerchantShopComponent,
                    },
                    {
                        path: 'purchase-history',
                        component: PurchaseHistoryComponent,
                    },
                ],
            },
        ]),
    ],
    exports: [RouterModule],
})
export class LandingRoutingModule {}
