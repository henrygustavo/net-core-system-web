import {Component, OnInit, OnDestroy} from '@angular/core';
import {MenuService} from '../../../shared/services/menu.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {NgBlockUI, BlockUI} from 'ng-block-ui';
import {Subscription} from 'rxjs';

import {MessageAlertHandleService} from '../../../shared/services/message-alert-handle.service';
import {RoleService} from '../services/role.service';
import {Role} from '../models/role';

@Component({
    selector: 'role-detail-component',
    templateUrl: './role-detail.component.html'
})
export class RoleDetailComponent implements OnInit, OnDestroy {
    @BlockUI()blockUI: NgBlockUI;
    mainForm: FormGroup;
    subscription: Subscription = new Subscription();

    constructor(private fb: FormBuilder, private _menuService: MenuService,
                private _messageAlertHandleService: MessageAlertHandleService,
                private _route: ActivatedRoute, private _roleService: RoleService) {}

    ngOnInit(): void {

        this._menuService.selectMenuItem('roles');

        const routeSubscription = this._route.params.subscribe(params => {
                                        this.getModel(params['id']);
                                    });

        this.subscription.add(routeSubscription);
    }

    ngOnDestroy(): void {

        this.subscription.unsubscribe();
    }

    getModel(id: number): void {

        this.blockUI.start();

        let modelSubscription = this._roleService.get(id)
                    .subscribe((response: Role) => {

                        this.setUpFormControls(response);
                        this.blockUI.stop();
                    }, (error: any) => {

                        this._messageAlertHandleService.handleError(error);
                        this.blockUI.stop();
                    });

        this.subscription.add(modelSubscription);

    }

    setUpFormControls(model: Role): void {

        const formSubscription = this._route.params.subscribe((): void => {

                this.mainForm = this.fb.group({
                        id: model.id,
                        name: new FormControl({value: model.name, disabled: true}),
                    });
            });

        this.subscription.add(formSubscription);

    }
}
