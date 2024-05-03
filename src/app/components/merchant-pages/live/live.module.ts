import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRoutingModule } from './live-routing.module';
import { LiveComponent } from './live.component';
import { ButtonModule } from 'primeng/button';
import { CheckboxModule } from 'primeng/checkbox';

@NgModule({
    declarations: [LiveComponent],
    imports: [CommonModule, LiveRoutingModule, ButtonModule, CheckboxModule],
})
export class LiveModule {}
