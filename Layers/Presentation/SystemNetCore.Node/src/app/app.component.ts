import { Component, OnInit } from '@angular/core';
import './assets/css/app.css';


@Component({ selector: 'app', templateUrl: './app.component.html' })
export class AppComponent implements OnInit {

    constructor() {
        console.log('AppComponent -> constructor');
    }

    ngOnInit() {

        console.log('AppComponent -> ngOnInit');
    }
}
