import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivateFn,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { StorageService } from 'src/app/services/storage.service';
@Injectable({
    providedIn: 'root',
})
export class AuthGuard {
    constructor(private authService: StorageService, private router: Router) {}
    canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ):
        | Observable<boolean | UrlTree>
        | Promise<boolean | UrlTree>
        | boolean
        | UrlTree {
        if (this.authService.getDataFromCookie('jwtToken')) {
            return true;
        } else this.router.navigate(['/auth/login']);
        return false;
    }
}
