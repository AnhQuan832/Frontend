import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { LoginComponent } from '../components/auth/login/login.component';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html',
    providers: [LoginComponent],
})
export class AppTopBarComponent {
    items!: MenuItem[];

    @ViewChild('menubutton') menuButton!: ElementRef;

    @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;

    @ViewChild('topbarmenu') menu!: ElementRef;

    constructor(
        public layoutService: LayoutService,
        private router: Router,
        private loginCpn: LoginComponent
    ) {
        this.items = [
            {
                label: 'Profile',
                command: () => {
                    this.router.navigate(['/merchant/profile']);
                },
            },
            {
                label: 'Log out',
                command: () => {
                    localStorage.clear();
                    this.loginCpn.signOut();
                    this.router.navigate(['/auth/login']);
                },
            },
        ];
    }
}
