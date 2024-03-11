import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VoucherManagementComponent } from './voucher-management.component';

const routes: Routes = [
    {
        path: '',
        component: VoucherManagementComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class VoucherManagementRoutingModule {}
