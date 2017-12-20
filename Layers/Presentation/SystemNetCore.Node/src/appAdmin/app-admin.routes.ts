import { Routes, RouterModule } from '@angular/router';

export const routes: Routes = [
    { path: 'account', loadChildren: './components/account/account.module#AcountModule' },
    { path: '', loadChildren: './components/admin/admin.module#AdminModule' }
];

export default RouterModule.forRoot(routes, { useHash: true });
