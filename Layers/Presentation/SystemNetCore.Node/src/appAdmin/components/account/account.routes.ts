import { Route, RouterModule } from '@angular/router';

import { AccountGuard } from './guards/account.guard';
import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerificationEmailComponent } from './verification-email/verification-email.component';

export const AccountnRoutes: Route[] = [
    { path: 'login', component: LoginComponent , canActivate: [AccountGuard]},
    { path: 'recover-password', component: RecoverPasswordComponent, canActivate: [AccountGuard] },
    { path: 'reset-password/:token', component: ResetPasswordComponent , canActivate: [AccountGuard]},
    { path: 'verification-email/:idUser/:token', component: VerificationEmailComponent , canActivate: [AccountGuard]},
    { path: '**', redirectTo: 'login', pathMatch: 'full', canActivate: [AccountGuard] }
];

export default RouterModule.forChild(AccountnRoutes);
