import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterComponent } from './register/register.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
    SocialLoginModule,
    GoogleSigninButtonModule,
} from '@abacritt/angularx-social-login';
import { DividerModule } from 'primeng/divider';
import { PasswordModule } from 'primeng/password';
import { LoginComponent } from './login/login.component';
import { InputTextModule } from 'primeng/inputtext';
import { SharedModule } from '../shared/shared.module';

@NgModule({
    imports: [
        CommonModule,
        AuthRoutingModule,
        FormsModule,
        ReactiveFormsModule,
        DividerModule,
        PasswordModule,
        SocialLoginModule,
        GoogleSigninButtonModule,
        InputTextModule,
        SharedModule,
    ],
    declarations: [LoginComponent, RegisterComponent, ForgotPasswordComponent],
    exports: [LoginComponent],
})
export class AuthModule {}
