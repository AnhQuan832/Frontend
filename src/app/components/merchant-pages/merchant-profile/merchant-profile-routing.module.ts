import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MerchantProfileComponent } from './merchant-profile.component';

const routes: Routes = [
    {
        path: '',
        component: MerchantProfileComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class MerchantProfileRoutingModule {}
