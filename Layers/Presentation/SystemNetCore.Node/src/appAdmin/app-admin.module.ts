import { NgModule } from '@angular/core';
import { HttpModule } from '@angular/http';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule  } from '@angular/forms';
import { NgxPermissionsModule } from 'ngx-permissions';
import { Ng2UiAuthModule } from 'ng2-ui-auth';
import { AuthConfig } from './authConfig';
import { ToastModule } from 'ng2-toastr';
import { BlockUIModule } from 'ng-block-ui';

import { AppAdminComponent } from './app-admin.component';
import { HeaderComponent } from './shared/components/header.component';
import { MessageAlertHandleService } from './shared/services/message-alert-handle.service';
import { AuthenticationService } from './shared/services/authentication.service';
import { MenuService } from './shared/services/menu.service';

import appRoutes from './app-admin.routes';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        Ng2UiAuthModule.forRoot(AuthConfig),
        ToastModule.forRoot(),
        NgxPermissionsModule.forRoot(),
        BrowserAnimationsModule,
        BlockUIModule,
        ReactiveFormsModule ,
        appRoutes
    ],
    declarations: [
        AppAdminComponent,
        HeaderComponent
    ],
    bootstrap: [AppAdminComponent],
    providers: [
        MessageAlertHandleService,
        AuthenticationService,
        MenuService
    ]
})
export class AppAdminModule { }
