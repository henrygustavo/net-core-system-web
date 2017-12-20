import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { FormGroup, FormBuilder } from '@angular/forms';
import { Subscription } from 'rxjs';

import { RoleService } from '../services/role.service';
import { Role } from '../models/role';
import { MessageAlertHandleService } from '../../../shared/services/message-alert-handle.service';
import { Pagination } from '../models/pagination';
import { MenuService } from '../../../shared/services/menu.service';
import { UtilService } from '../services/util.service';
import { PaginationResult } from '../models/pagination-result';

@Component({
    selector: 'role-list-component',
    templateUrl: './role-list.component.html'
})
export class RoleListComponent implements OnInit {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChild('editTmplRow') editTmplRow: TemplateRef<any>;
    rows = new Array<Role>();
    columns: Array<any> = [];
    searchForm: FormGroup;
    subscription: Subscription = new Subscription();
    pagination: Pagination = new Pagination();

    constructor(
                 private fb: FormBuilder,
                 private _roleService: RoleService,
                 private _messageAlertHandleService: MessageAlertHandleService,
                 private _menuService: MenuService,
                 private _utilService: UtilService ) {

    }

    ngOnInit(): void {

        this._menuService.selectMenuItem('roles');

        this.searchForm =  this.fb.group({name: ''});

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
            { prop: 'name', name: 'Role Name' },
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

        let roleGetAllSubscription = this._roleService.getAll(this.pagination).subscribe(
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

        this.subscription.add(roleGetAllSubscription);
    }

    setPage(pageInfo: any) {

        this.pagination.currentPage = pageInfo.offset + 1;

        this.loadData();
    }

    search(): void {
         this.loadData();
    }

}
