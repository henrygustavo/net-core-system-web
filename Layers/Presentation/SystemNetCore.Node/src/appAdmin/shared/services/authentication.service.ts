import {Injectable} from '@angular/core';
import {Http, Response, Headers } from '@angular/http';
import {Observable} from 'rxjs/Observable';
import { JwtHttp } from 'ng2-ui-auth';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import * as globals from '../../globals';

@Injectable()
export class AuthenticationService {

    private _url = '';
    private headers = new Headers({'Content-Type': 'application/json'});

    constructor(private _http: Http,
        private _jwhttp: JwtHttp) {

        this._url = globals.apiURL + 'auth/';
    }

    public login(user: any) {

        let bodyString = JSON.stringify(user);

        return this._http
            .post(`${this._url}login`, bodyString, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    public recoverPassword(model: any) {

        let bodyString = JSON.stringify(model);

        return this._http
            .post(`${this._url}recover_password`, bodyString, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    public resetPassword(model: any) {

        let bodyString = JSON.stringify(model);

        return this._http
            .post(`${this._url}reset_password`, bodyString, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    public changePassword(model: any) {

        let bodyString = JSON.stringify(model);

        return this._jwhttp
            .post(`${this._url}change_password`, bodyString, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    public verificationToken(model: any) {

        let bodyString = JSON.stringify(model);

        return this._http
            .post(`${this._url}confirm-email`, bodyString, {headers: this.headers})
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }
}
