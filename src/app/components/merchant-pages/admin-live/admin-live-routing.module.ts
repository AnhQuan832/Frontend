import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminLiveComponent } from './admin-live.component';

const routes: Routes = [
    {
        path: '',
        component: AdminLiveComponent,
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class AdminLiveRoutingModule {}
