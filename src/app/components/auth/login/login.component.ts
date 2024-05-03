import { SocialAuthService } from '@abacritt/angularx-social-login';
import { Component, OnInit } from '@angular/core';
import {
    AbstractControl,
    FormBuilder,
    ValidatorFn,
    Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
    GoogleLoginProvider,
    FacebookLoginProvider,
} from '@abacritt/angularx-social-login';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';
import { BaseComponent } from 'src/app/base.component';
import { defer } from 'rxjs';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent extends BaseComponent implements OnInit {
    isSubmitted = false;
    msgError: string;
    private accessToken = '';
    constructor(
        private socialLoginService: SocialAuthService,
        private builder: FormBuilder,
        private authService: LoginService,
        private router: Router,
        private storageService: StorageService
    ) {
        super();
    }

    loginForm = this.builder.group({
        userEmail: this.builder.control('', [Validators.required]),
        userPassword: this.builder.control('', [Validators.required]),
    });
    ngOnInit(): void {
        this.loginWithGoogle();
        document.cookie =
            'jwtToken' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    loginWithGoogle() {
        this.socialLoginService.authState.subscribe((user) => {
            this.authService.loginGoogle(user).subscribe((res) => {
                if (typeof res === 'string') {
                    this.msgError = res;
                    return;
                }
                this.setInfo(res);
                this.router.navigate(['/user/home']);
            });
        });
    }

    login() {
        this.isSubmitted = true;

        if (this.loginForm.valid)
            this.authService
                .login(
                    this.loginForm.value.userEmail,
                    this.loginForm.value.userPassword
                )
                .subscribe({
                    next: (res) => {
                        if (typeof res === 'string') {
                            this.msgError = res;
                            return;
                        }
                        this.setInfo(res);
                        this.checkPermission(this.getRole());
                    },
                    error: (err) => console.log(err),
                });
    }

    getAccessToken(): void {
        this.socialLoginService
            .getAccessToken(GoogleLoginProvider.PROVIDER_ID)
            .then((accessToken) => (this.accessToken = accessToken));
    }
    public signOut(): void {
        this.socialLoginService.signOut();
    }
    refreshToken(): void {
        this.socialLoginService.refreshAuthToken(
            GoogleLoginProvider.PROVIDER_ID
        );
    }

    clearErrorNotification() {
        this.isSubmitted = false;
    }

    emailValidator(exceptionEmail: string): ValidatorFn {
        return (control: AbstractControl): { [key: string]: any } | null => {
            const email = control.value;
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

            if (!emailRegex.test(email)) {
                return { invalidEmail: true };
            } else {
                return null;
            }
        };
    }

    setInfo(data) {
        const { jwtToken, ...userInfo } = data;
        this.storageService.setItemLocal('currentUser', userInfo);
        this.setUserInfo(userInfo);
        this.setRole(userInfo.userRoles[0].roleName);
        this.storageService.setTimeResetTokenCookie('jwtToken', jwtToken);
    }

    checkPermission(roles) {
        switch (roles) {
            case 'ROLE_MERCHANT':
            case 'ROLE_ADMIN':
                this.router.navigate(['/merchant']);
                break;
            case 'ROLE_CUSTOMER':
                this.router.navigate(['/user/home']);
                break;
        }
    }
}
