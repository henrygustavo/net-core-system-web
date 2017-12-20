import {Component, OnInit, OnDestroy} from '@angular/core';
import {MenuService} from '../../../shared/services/menu.service';
import {FormBuilder, FormControl, FormGroup} from '@angular/forms';
import {ActivatedRoute} from '@angular/router';
import {NgBlockUI, BlockUI} from 'ng-block-ui';
import {Subscription} from 'rxjs';

import {MessageAlertHandleService} from '../../../shared/services/message-alert-handle.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';

@Component({
    selector: 'user-detail-component',
    templateUrl: './user-detail.component.html'
})
export class UserDetailComponent implements OnInit, OnDestroy {
    @BlockUI()blockUI: NgBlockUI;
    mainForm: FormGroup;
    subscription: Subscription = new Subscription();

    constructor(private fb: FormBuilder, private _menuService: MenuService,
                private _messageAlertHandleService: MessageAlertHandleService,
                private _route: ActivatedRoute, private _userService: UserService) {}

    ngOnInit(): void {

        this._menuService.selectMenuItem('users');

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

        let modelSubscription = this._userService.get(id)
                    .subscribe((response: User) => {

                        this.setUpFormControls(response);
                        this.blockUI.stop();
                    }, (error: any) => {

                        this._messageAlertHandleService.handleError(error);
                        this.blockUI.stop();
                    });

        this.subscription.add(modelSubscription);

    }

    setUpFormControls(model: User): void {

        const formSubscription = this._route.params.subscribe((): void => {

                this.mainForm = this.fb.group({
                        id: model.id,
                        userName: new FormControl({value: model.userName, disabled: true}),
                        email: new FormControl({value: model.email, disabled: true}),
                        disabled: new FormControl({value: model.disabled, disabled: true}),
                        lockoutEnabled: new FormControl({value: model.lockoutEnabled, disabled: true}),
                        phoneNumber: new FormControl({value: model.phoneNumber, disabled: true}),
                        role: new FormControl({value: model.role, disabled: true}),
                    });
            });

        this.subscription.add(formSubscription);

    }
}
