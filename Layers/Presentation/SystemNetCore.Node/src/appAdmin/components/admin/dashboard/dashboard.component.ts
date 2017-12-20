import { Component, OnInit } from '@angular/core';

import { MenuService } from '../../../shared/services/menu.service';

@Component({
    selector: 'dashboard-component',
    templateUrl: './dashboard.component.html'
})
export class DashBoardComponent implements OnInit {

    constructor( private _menuService: MenuService ) {

    }

    ngOnInit(): void {

        this._menuService.selectMenuItem('dashboard');

    }
}
