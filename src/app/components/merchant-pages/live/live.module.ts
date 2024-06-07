import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRoutingModule } from './live-routing.module';
import { LiveComponent } from './live.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';
import { SharedModule } from '../../shared/shared.module';
import { MenuModule } from 'primeng/menu';
import { TooltipModule } from 'primeng/tooltip';

@NgModule({
    declarations: [LiveComponent],
    imports: [
        CommonModule,
        LiveRoutingModule,
        ButtonModule,
        CheckboxModule,
        SharedModule,
        MenuModule,
        TooltipModule,
    ],
})
export class LiveModule {}
