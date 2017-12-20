import {Injectable} from '@angular/core';
import {JwtHttp} from 'ng2-ui-auth';
import {Observable} from 'rxjs/Observable';

import {User} from '../models/user';
import {BaseResourceService} from '../services/base-resource.service';

@Injectable()
export class UserService extends BaseResourceService <User> {
    constructor(private _jwHttp: JwtHttp) {
        super(_jwHttp, 'users');
    }

    public getByEmail(email: string): Observable <User> {

        let entity$ = this
            ._jwHttp
            .get(`${this.baseUrl}/email/${email}`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }

    public getByUserName(userName: string): Observable <User> {

        let entity$ = this
            ._jwHttp
            .get(`${this.baseUrl}/userName/${userName}`)
            .map((response: any) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }
}
