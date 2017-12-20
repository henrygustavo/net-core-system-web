import { Injectable } from '@angular/core';
import { Response, RequestOptions, Headers } from '@angular/http';
import { JwtHttp } from 'ng2-ui-auth';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/throw';

import { PaginationResult } from '../models/pagination-result';
import { Pagination } from '../models/pagination';
import * as globals from '../../../globals';

@Injectable()
export abstract class BaseResourceService<T> {

    public baseUrl = '';

    constructor(private _http: JwtHttp, _url: string) {

        this.baseUrl = globals.apiURL + _url;

    }

    public getAll(pagination: Pagination): Observable<PaginationResult> {

        let entities$ = this
            ._http
            .get(this.getHttpUrl(pagination))
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entities$;
    }

    public get(id: number): Observable<T> {

        let entity$ = this._http
            .get(`${this.baseUrl}/${id}`)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
        return entity$;
    }

    private insert(entity: T, options: RequestOptions): Observable<T> {

        return this._http
            .post(this.baseUrl, entity, options)
            .map((response: Response) => response.json())
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    private update(entity: T, id: number, options: RequestOptions): Observable<T> {

        const url = `${this.baseUrl}/${id}`;
        return this._http
            .put(url, entity, options)
            .map(() => entity)
            .catch((error: any) => Observable.throw(error || 'Server error'));
    }

    save(entity: T, id: number): Observable<T> {
        let headers = new Headers({ 'Content-Type': 'application/json' });
        let options = new RequestOptions({ headers: headers });

        if (id === 0) {
            return this.insert(entity, options);
        }
        return this.update(entity, id, options);
    }

    private getHttpUrl(pagination: Pagination): string {

        let url = this.baseUrl;

        if (pagination.currentPage !== undefined) {

            url = `${url}?page=${pagination.currentPage}`;
        }

        if (pagination.pageSize !== undefined) {
            url = `${url}&pageSize=${pagination.pageSize}`;
        }

        if (pagination.sortBy !== undefined) {
            url = `${url}&sortBy=${pagination.sortBy}`;
        }

        if (pagination.sortDirection !== undefined) {
            url = `${url}&sortDirection=${pagination.sortDirection}`;
        }

        if (pagination.searchCriteria !== undefined) {

            for (let criteria of pagination.searchCriteria) {
                url = `${url}&${criteria.key}=${criteria.value}`;
            }
        }

        return url;
    }
}
