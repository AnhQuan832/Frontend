import { AdminLiveComponent } from './admin-live.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminLiveRoutingModule } from './admin-live-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { PaginatorModule } from 'primeng/paginator';
import { ButtonModule } from 'primeng/button';
import { TooltipModule } from 'primeng/tooltip';
import { MenuModule } from 'primeng/menu';
import { QuickviewLiveComponent } from './quickview-live/quickview-live.component';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
    declarations: [AdminLiveComponent, QuickviewLiveComponent],
    imports: [
        CommonModule,
        AdminLiveRoutingModule,
        ReactiveFormsModule,
        FormsModule,
        TableModule,
        PaginatorModule,
        ButtonModule,
        TooltipModule,
        MenuModule,
        SharedModule,
    ],
})
export class AdminLiveModule {}
