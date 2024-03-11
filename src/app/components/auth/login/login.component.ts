import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { LoginService } from 'src/app/services/login.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `
            :host ::ng-deep .pi-eye,
            :host ::ng-deep .pi-eye-slash {
                transform: scale(1.6);
                margin-right: 1rem;
                color: var(--primary-color) !important;
            }
        `,
    ],
})
export class LoginComponent implements OnInit {
    valCheck: string[] = ['remember'];
    err;

    password!: string;
    email!: string;
    protected isSubmitted: boolean = false;
    protected msgError: string;
    constructor(
        public layoutService: LayoutService,
        private loginService: LoginService,
        private router: Router,
        private storageService: StorageService
    ) {}
    ngOnInit(): void {
        document.cookie =
            'jwtToken' + '=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    }

    login() {
        this.isSubmitted = true;
        if (this.email && this.password)
            this.loginService.login(this.email, this.password).subscribe({
                next: (res) => {
                    if (res) {
                        if (
                            res.userRoles[0].roleName === 'ROLE_ADMIN' ||
                            res.userRoles[1].roleName === 'ROLE_ADMIN'
                        ) {
                            sessionStorage.setItem('userRoles', 'ROLE_ADMIN');
                            const { jwtToken, ...userInfo } = res;
                            this.storageService.setItemLocal(
                                'userInfo',
                                userInfo
                            );
                            this.storageService.setTimeResetTokenCookie(
                                'jwtToken',
                                jwtToken
                            );
                            this.router.navigate(['']);
                        }
                    } else this.err = true;
                },
                error: (err) => (this.err = err),
            });
    }
}
