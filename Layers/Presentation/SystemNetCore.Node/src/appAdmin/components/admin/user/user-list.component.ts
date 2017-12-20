import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserService } from '../services/user.service';
import { User } from '../models/user';
import { MessageAlertHandleService } from '../../../shared/services/message-alert-handle.service';
import { Pagination } from '../models/pagination';
import { MenuService } from '../../../shared/services/menu.service';
import { UtilService } from '../services/util.service';
import { PaginationResult } from '../models/pagination-result';

@Component({
    selector: 'user-list-component',
    templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;
    rows = new Array<User>();
    columns: Array<any> = [];
    searchForm: FormGroup;
    subscription: Subscription = new Subscription();
    pagination: Pagination = new Pagination();

    constructor(
                 private fb: FormBuilder,
                 private _userService: UserService,
                 private _messageAlertHandleService: MessageAlertHandleService,
                 private _menuService: MenuService,
                 private _utilService: UtilService ) {

    }

    ngOnInit(): void {

        this._menuService.selectMenuItem('users');

        this.searchForm =  this.fb.group({userName: '', email: ''});

        this.initializePagination();
        this.setPage({ offset: 0 });
    }

    ngOnDestroy(): void {

                this.subscription.unsubscribe();
     }

    onSort(event: any) {

        const sort = event.sorts[0];

        this.pagination.sortBy = sort.prop;
        this.pagination.sortDirection = sort.dir;

        this.loadData();
    }

    initializePagination (): void {

        this.columns = [
            { prop: 'id' },
            { prop: 'userName', name: 'User Name' },
            { prop: 'email', name: 'Email' },
            { prop: 'phoneNumber', name: 'Phone Number' },
            { prop: 'disabled', name: 'Disabled' },
            { prop: 'lockoutEnabled', name: 'Lockout Enabled' },
            { prop: '', name: '', cellTemplate: this.editTmplRow}
        ];

        this.pagination.sortBy = 'id';
        this.pagination.sortDirection = 'desc';
        this.pagination.currentPage = 1;
        this.pagination.pageSize = 10;
        this.pagination.searchCriteria = [];
        this.pagination.totalRecords = 0;
    }

    loadData(): void {

        this.blockUI.start();

        this.pagination.searchCriteria = this._utilService.getSearchCriteria(this.searchForm);

        let userGetAllSubscription = this._userService.getAll(this.pagination).subscribe(
            (response: PaginationResult) => {

                        this.pagination.totalRecords = response.totalRecords;
                        this.pagination.totalPages = response.totalPages;

                        this.rows = response.content;

                        this.blockUI.stop();
            },
            (error: any) => {
                        this._messageAlertHandleService.handleError(error);

                        this.blockUI.stop();
            }
        );

        this.subscription.add(userGetAllSubscription);
    }

    setPage(pageInfo: any) {

        this.pagination.currentPage = pageInfo.offset + 1;

        this.loadData();
    }

    search(): void {
         this.loadData();
    }

}
