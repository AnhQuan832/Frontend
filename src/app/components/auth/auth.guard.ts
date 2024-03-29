import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { BaseComponent } from 'src/app/base.component';
import { StorageService } from 'src/app/services/storage.service';
import { UserService } from 'src/app/services/user.service';
@Injectable({
    providedIn: 'root',
})
export class AuthGuard extends BaseComponent {
    constructor(
        private authService: StorageService,
        private router: Router,
        private userService: UserService
    ) {
        super();
    }
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        const role = route.data['userRoles'] as Array<string>;
        if (this.authService.getDataFromCookie('jwtToken')) {
            let currentRole = this.getRole();
            if (!currentRole) {
                this.userService.getProfile().subscribe({
                    next: (res) => {
                        this.setRole(res.userRoles[0].roleName);
                        currentRole = this.getRole();
                        if (role.includes(currentRole)) return true;
                        else {
                            this.routeToLogin();
                            return false;
                        }
                    },
                });
            } else if (role.includes(currentRole)) return true;
            else this.routeToLogin();
        } else this.routeToLogin();
        return false;
    }

    routeToLogin() {
        this.router.navigate(['/auth/login']);
    }
}
