import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantComponent } from './merchant.component';
import { MerchantRequestComponent } from './merchant-request/merchant-request.component';
import { MerchantDetailComponent } from './merchant-detail/merchant-detail.component';

const routes: Routes = [
    {
        path: '',
        component: MerchantComponent,
    },
    {
        path: 'request',
        component: MerchantRequestComponent,
    },
    {
        path: 'detail/:id',
        component: MerchantDetailComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MerchantRoutingModule {}
