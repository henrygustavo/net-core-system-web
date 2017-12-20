import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './login/login.component';
import { RecoverPasswordComponent } from './recover-password/recover-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { VerificationEmailComponent } from './verification-email/verification-email.component';
import accountRoutes from './account.routes';
import { AccountGuard } from '../../shared/guards/account.guard';

@NgModule({
    imports: [
        CommonModule, ReactiveFormsModule, accountRoutes
    ],
    declarations: [LoginComponent, RecoverPasswordComponent,
                   ResetPasswordComponent, VerificationEmailComponent],
    providers: [AccountGuard]
})
export class AcountModule { }
