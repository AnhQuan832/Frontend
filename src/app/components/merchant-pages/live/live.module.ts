import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LiveRoutingModule } from './live-routing.module';
import { LiveComponent } from './live.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
    declarations: [LiveComponent],
    imports: [CommonModule, LiveRoutingModule, ButtonModule],
})
export class LiveModule {}
