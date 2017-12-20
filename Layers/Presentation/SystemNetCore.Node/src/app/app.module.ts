import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';

import appRoutes from './app.routes';

@NgModule({
    imports: [
        BrowserModule,
        HttpModule,
        appRoutes
    ],
    declarations: [
        AppComponent,
        HomeComponent
    ],
    bootstrap: [AppComponent],
    providers: [

    ]
})
export class AppModule { }
