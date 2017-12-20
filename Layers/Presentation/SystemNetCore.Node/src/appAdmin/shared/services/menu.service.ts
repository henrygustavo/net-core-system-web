import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Subject } from 'rxjs/Subject';

import { MenuItem } from '../models/menu-item';

@Injectable()
export class MenuService {

    private subject = new Subject<any>();

    public getListMenuItems(): MenuItem[] {

        return [

            new MenuItem('fa-home', 'dashboard', 'dashboard', 'DashBoard', ['ADMIN', 'MEMBER']),
            new MenuItem('fa-edit', 'users', 'users', 'Users', ['ADMIN']),
            new MenuItem('fa-edit', 'roles', 'roles', 'Roles', ['ADMIN'])
        ];
    }

    public selectMenuItem(selectedMenuItem: string) {
        this.subject.next({ text: selectedMenuItem });
    }

    public getSelectedMenuItem(): Observable<any> {
        return this.subject.asObservable();
    }
}
