import { Component, OnInit, ViewContainerRef } from '@angular/core';
import { Router, NavigationStart } from '@angular/router';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { AuthService } from 'ng2-ui-auth';
import { NgxRolesService } from 'ngx-permissions';

import './assets/css/bootstrap.css';
import './assets/css/app-admin.css';
import './assets/css/theme.css';
import './assets/css/metisMenu.css';
import 'font-awesome/css/font-awesome.css';
import 'ng2-toastr/bundles/ng2-toastr.min.css';
// ngx-datatable
 import '@swimlane/ngx-datatable/release/themes/material.css';
 import '@swimlane/ngx-datatable/release/assets/icons.css';

@Component({
    selector: 'app-admin',
    templateUrl: './app-admin.component.html'
})

export class AppAdminComponent implements OnInit {

    public isAuthenticated: boolean;

    constructor(
        public _containerRef: ViewContainerRef,
        private _authService: AuthService,
        private _ngxRolesService: NgxRolesService,
        private toastr: ToastsManager,
        private _router: Router) {

        this.toastr.setRootViewContainerRef(_containerRef);

    }

    ngOnInit() {

        this._router.events.filter(event => event instanceof NavigationStart)
            .subscribe(() => {
                this.isAuthenticated = this._authService.isAuthenticated();

                this.handlePermissionsByRole();

            });
    }

    handlePermissionsByRole(): void {

        let role = this._authService.isAuthenticated() && this._authService.getPayload() !== undefined
                           ? this._authService.getPayload().role.toLowerCase() : '';

        this._ngxRolesService.addRoles({
            'ADMIN': () => {
                return this._authService.isAuthenticated() &&
                       role === 'admin';
            },
            'MEMBER': () => {
                return this._authService.isAuthenticated() &&
                        role === 'member';
            },
            'GUEST': () => {
                return !this._authService.isAuthenticated();
            }
          });
    }
}
