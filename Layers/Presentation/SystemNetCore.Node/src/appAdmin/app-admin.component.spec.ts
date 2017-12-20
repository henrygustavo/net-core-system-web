import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from 'ng2-ui-auth';
import { ToastsManager } from 'ng2-toastr/ng2-toastr';
import { NgxRolesService, NgxRolesStore, NgxPermissionsService, NgxPermissionsStore } from 'ngx-permissions';

import { AppAdminComponent } from './app-admin.component';
class MockAuthService extends AuthService {
    constructor() {
        super(null, null, null);
    }
}


class MockToastsManager extends ToastsManager {
    constructor() {
        super(null, null, null, null);
    }
}

class MockNgxRolesService extends NgxRolesService {
    constructor() {
        super(false, new NgxRolesStore(),
        new NgxPermissionsService(false, new NgxPermissionsStore()));
    }
}


let component: AppAdminComponent;
// let authService: AuthService;
// let toastsManager: ToastsManager;
// let ngxRolesService: NgxRolesService;

describe('AppAdmin', () => {
    beforeEach(() => {

        TestBed.configureTestingModule({
            imports: [RouterTestingModule],
            declarations: [AppAdminComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                {
                    provide: AuthService,
                    useClass: MockAuthService
                },
                {
                    provide: ToastsManager,
                    useClass: MockToastsManager
                },
                {
                    provide: NgxRolesService,
                    useClass: MockNgxRolesService
                }
            ]
        });

        component = TestBed.createComponent(AppAdminComponent).componentInstance;
        // authService = TestBed.get(AuthService);
        // toastsManager = TestBed.get(ToastsManager);
        // ngxRolesService = TestBed.get(NgxRolesService);
    });

    it('should work', () => {

        expect(component instanceof AppAdminComponent).toBe(true, 'should create AppAdminComponent');
    });

});
