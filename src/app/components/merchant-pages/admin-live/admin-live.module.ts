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

@NgModule({
    declarations: [AdminLiveComponent],
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
    ],
})
export class AdminLiveModule {}
