import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SaleRoutingModule } from './sale-routing.module';
import { SaleComponent } from './sale.component';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DropdownModule } from 'primeng/dropdown';
import { TableModule } from 'primeng/table';

@NgModule({
    declarations: [SaleComponent],
    imports: [
        CommonModule,
        SaleRoutingModule,
        ChartModule,
        CalendarModule,
        FormsModule,
        ReactiveFormsModule,
        DropdownModule,
        TableModule,
    ],
})
export class SaleModule {}
