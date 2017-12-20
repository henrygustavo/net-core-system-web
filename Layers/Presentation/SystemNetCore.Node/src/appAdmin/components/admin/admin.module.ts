import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {NgxDatatableModule} from '@swimlane/ngx-datatable';

import {RoleListComponent} from './role/role-list.component';
import {RoleEditComponent} from './role/role-edit.component';
import {RoleDetailComponent } from './/role/role-detail.component';
import {UserListComponent} from './user/user-list.component';
import {UserEditComponent} from './user/user-edit.component';
import {UserDetailComponent } from './user/user-detail.component';
import {DashBoardComponent} from './dashboard/dashboard.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {UserService} from './services/user.service';
import {RoleService} from './services/role.service';
import {UtilService} from './services/util.service';
import {AdminGuard} from '../../shared/guards/admin.guard';
import AdminRoutes from './admin.routes';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        NgxDatatableModule,
        AdminRoutes
    ],
    declarations: [
        DashBoardComponent,
        UserListComponent,
        UserEditComponent,
        UserDetailComponent,
        RoleListComponent,
        RoleEditComponent,
        RoleDetailComponent,
        ChangePasswordComponent
    ],
    providers: [UtilService, UserService, RoleService, AdminGuard]
})
export class AdminModule {}
