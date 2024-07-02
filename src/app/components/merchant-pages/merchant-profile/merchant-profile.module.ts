import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MerchantProfileRoutingModule } from './merchant-profile-routing.module';
import { MerchantProfileComponent } from './merchant-profile.component';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';

@NgModule({
    declarations: [MerchantProfileComponent],
    imports: [
        CommonModule,
        MerchantProfileRoutingModule,
        TooltipModule,
        InputTextModule,
        InputNumberModule,
        DropdownModule,
        InputTextareaModule,
        FormsModule,
        ReactiveFormsModule,
        MenuModule,
        ButtonModule,
        DividerModule,
    ],
})
export class MerchantProfileModule {}
