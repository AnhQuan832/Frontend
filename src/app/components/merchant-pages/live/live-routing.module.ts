import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LiveComponent } from './live.component';
import { PendingChangesGuard } from './pending-change.guard';

const routes: Routes = [
    {
        path: '',
        component: LiveComponent,
        // canDeactivate: [PendingChangesGuard],
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class LiveRoutingModule {}
