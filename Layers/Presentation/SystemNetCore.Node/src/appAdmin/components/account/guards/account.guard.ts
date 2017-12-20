import { RouterStateSnapshot, ActivatedRouteSnapshot, Router, CanActivate } from '@angular/router';
import { AuthService } from 'ng2-ui-auth';
import { Injectable } from '@angular/core';


@Injectable()
export class AccountGuard implements CanActivate {

    constructor(private auth: AuthService, private router: Router) { }
    canActivate(
        _next: ActivatedRouteSnapshot,
        _state: RouterStateSnapshot
    ) {
        if (!this.auth.isAuthenticated()) { return true; }

        this.router.navigateByUrl('dashboard');

        return false;
    }
}
