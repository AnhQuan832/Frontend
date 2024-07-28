import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderComponent } from './order.component';
import { LiveOrderComponent } from './live-order/live-order.component';

const routes: Routes = [
    { path: '', component: OrderComponent },
    {
        path: 'live-order',
        component: LiveOrderComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderRoutingModule {}
