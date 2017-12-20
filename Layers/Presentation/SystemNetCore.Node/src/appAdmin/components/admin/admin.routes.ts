import {Route, RouterModule} from '@angular/router';
import {NgxPermissionsGuard} from 'ngx-permissions';

import {UserListComponent} from './user/user-list.component';
import {DashBoardComponent} from './dashboard/dashboard.component';
import {ChangePasswordComponent} from './change-password/change-password.component';
import {UserDetailComponent} from './user/user-detail.component';
import {UserEditComponent} from './user/user-edit.component';
import { RoleListComponent } from './role/role-list.component';
import { RoleDetailComponent } from './role/role-detail.component';
import { RoleEditComponent } from './role/role-edit.component';
import {AdminGuard} from '../../shared/guards/admin.guard';

export const AdminRoutes: Route[] = [
    {
        path: 'dashboard',
        component: DashBoardComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN', 'MEMBER']}}
    },
    {
        path: 'users',
        component: UserListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: {only: ['ADMIN']}}
    },
    {
        path: 'users/detail/:id',
        component: UserDetailComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: {only: ['ADMIN']}}
    },
    {
        path: 'users/edit/:id',
        component: UserEditComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: {only: ['ADMIN']}}
    },
    {
        path: 'roles',
        component: RoleListComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: {only: ['ADMIN']}}
    },
    {
        path: 'roles/detail/:id',
        component: RoleDetailComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: {only: ['ADMIN']}}
    },
    {
        path: 'roles/edit/:id',
        component: RoleEditComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: {only: ['ADMIN']}}
    },
    {
        path: 'change-password',
        component: ChangePasswordComponent,
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: {only: ['ADMIN', 'MEMBER']}}
    },
    {
        path: '**',
        redirectTo: 'dashboard',
        pathMatch: 'full',
        canActivate: [AdminGuard, NgxPermissionsGuard],
        data: { permissions: { only: ['ADMIN', 'MEMBER']}}
    }
];

export default RouterModule.forChild(AdminRoutes);
