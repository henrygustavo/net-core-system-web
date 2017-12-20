import {OnInit, ElementRef, ViewChildren, OnDestroy, Component, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, FormControlName, AbstractControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs/Observable';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

import {MessageAlertHandleService} from '../../../shared/services/message-alert-handle.service';
import {GenericValidator} from '../../../shared/validators/generic-validator';
import {MenuService} from '../../../shared/services/menu.service';
import {RoleService} from '../services/role.service';
import {Role} from '../models/role';
import {Dictionary} from '../models/dictionary';

@Component({
        selector: 'role-edit-component',
        templateUrl: './role-edit.component.html'
})
export class RoleEditComponent implements OnInit, OnDestroy, AfterViewInit {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements: ElementRef[] = [];
    displayMessage: {[key: string]: string} = {};
    roles: Array<Dictionary> = [];
    validationMessages: {[key: string]: {[key: string]: string}};
    genericValidator: GenericValidator;
    subscription: Subscription = new Subscription();
    mainForm: FormGroup;
    role: Role;
    constructor(
                private fb: FormBuilder, private _router: Router,
                private _menuService: MenuService,
                private _messageAlertHandleService: MessageAlertHandleService,
                private _route: ActivatedRoute,
                private _roleService: RoleService) {

    }

    ngOnInit(): void {

        this._menuService.selectMenuItem('roles');

        this.setUpValidationMessages();

        this.setUpFormControls();

    }

    ngAfterViewInit(): void {

        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        let controlSubscription = Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.mainForm);
        });

        this.subscription.add(controlSubscription);

    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
    }

    setUpValidationMessages(): void {

        this.validationMessages = {
            name: {
                required: 'Role Name is required.',
                minlength: 'Role Name must be at least 5 characters.',
                isRoleNameUnique: 'Please fill out another role Name'
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    getModel(id: number): void {

        this.blockUI.start();

        let modelSubscription = this._roleService.get(id).subscribe(
            (response: Role) => {

                    this.role = response;

                    this.mainForm.patchValue(
                    {
                        name: response.name
                    });

                    this.blockUI.stop();
            },
            (error: any) => {

                    this._messageAlertHandleService.handleError(error);
                    this.blockUI.stop();
            }
        );

        this.subscription.add(modelSubscription);

    }

    setUpFormControls(): void {

        const formSubscription = this._route.params.subscribe(

            (params): void => {

                const id: number = Number(params['id']);

                this.mainForm = this.fb.group({
                    id: id,
                    name: new FormControl({ value: '' },
                                                [Validators.required, Validators.minLength(5)],
                                                this.validateRoleName.bind(this))
                });

                this.getModel(id);

            });

            this.subscription.add(formSubscription);

    }

    validateRoleName(control: AbstractControl) {

        const promise = new Promise((resolve) => {

            this._roleService.getByName(control.value).subscribe(
                (response: Role) => {

                    resolve(response.id === 0 ? null : {'isRoleNameUnique': false} );
                },
                 () => {
                    resolve({'isRoleNameUnique': false});
                });

        });

        return promise;
    }

    save(): void {

        if (this.mainForm.dirty && this.mainForm.valid) {
            // Copy the form values over the product object values
            let model = Object.assign({}, this.role, this.mainForm.value);

            this.blockUI.start();
            let roleSaveSubscription =  this._roleService.save(model, Number(model.id)).subscribe(
                () => {
                    // Reset the form to clear the flags
                        this._messageAlertHandleService.handleSuccess('Saved successfully');
                        this.mainForm.reset();
                        this.blockUI.stop();
                        this._router.navigate(['/roles']);
                },
                error => {
                    this._messageAlertHandleService.handleError(error);
                    this.blockUI.stop();
                }
             );

            this.subscription.add(roleSaveSubscription);
        }
    }
}
