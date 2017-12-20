import {Injectable} from '@angular/core';
import {BaseResourceService} from '../services/base-resource.service';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';

import {Dictionary} from '../models/dictionary';
import {Role} from '../models/role';

@Injectable()
export class RoleService extends BaseResourceService < Role > {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'roles');
    }

    public getEnabledRoles(): Observable < Array < Dictionary >> {

        let entity$ = this._jwHttp
            .get(`${this.baseUrl}/enabled`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }

    public getByName(name: string): Observable <Role> {

        let entity$ = this
            ._jwHttp
            .get(`${this.baseUrl}/name/${name}`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }
}
