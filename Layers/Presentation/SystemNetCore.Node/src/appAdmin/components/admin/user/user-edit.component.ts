import {OnInit, ElementRef, ViewChildren, OnDestroy, Component, AfterViewInit} from '@angular/core';
import {FormBuilder, FormGroup, FormControl, Validators, FormControlName, AbstractControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {Router, ActivatedRoute} from '@angular/router';
import {CustomValidators} from 'ng2-validation';
import {Observable} from 'rxjs/Observable';
import {BlockUI, NgBlockUI} from 'ng-block-ui';

import {MessageAlertHandleService} from '../../../shared/services/message-alert-handle.service';
import {GenericValidator} from '../../../shared/validators/generic-validator';
import {MenuService} from '../../../shared/services/menu.service';
import {UserService} from '../services/user.service';
import {User} from '../models/user';
import {RoleService} from '../services/role.service';
import {Dictionary} from '../models/dictionary';
import * as globals from '../../../globals';

@Component({
        selector: 'user-edit-component',
        templateUrl: './user-edit.component.html'
})
export class UserEditComponent implements OnInit, OnDestroy, AfterViewInit {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements: ElementRef[] = [];
    displayMessage: {[key: string]: string} = {};
    roles: Array<Dictionary> = [];
    validationMessages: {[key: string]: {[key: string]: string}};
    genericValidator: GenericValidator;
    subscription: Subscription = new Subscription();
    mainForm: FormGroup;
    user: User;
    constructor(
                private fb: FormBuilder, private _router: Router,
                private _menuService: MenuService,
                private _messageAlertHandleService: MessageAlertHandleService,
                private _route: ActivatedRoute,
                private _userService: UserService,
                private _roleService: RoleService) {

    }

    ngOnInit(): void {

        this._menuService.selectMenuItem('users');

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
            idRole: {
                required: 'Role is required.',
                min: 'Please select a role',
            },
            userName: {
                required: 'User Name is required.',
                minlength: 'User Name must be at least 4 characters.',
                isUserNameUnique: 'Please fill out another user Name'
            },
            email: {
                required: 'Email is required.',
                minlength: 'Email must be at least 4 characters.',
                email: 'Please enter a valid email address.',
                isEmailUnique : 'Please fill out another email'
            },
            phoneNumber: {
                digits: 'Please enter a valid phone number',
            },
            password: {
                required: 'Password is required.',
                minlength: 'Password must be at least 6 characters.'
            },
            confirmPassword: {
                required: 'Password is required.',
                minlength: 'Password must be at least 6 characters.',
                equalTo: 'ConfirmPassword does not match with Password'

            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    getModel(id: number): void {

        this.getAllRoles();

        this.blockUI.start();

        let modelSubscription = this._userService.get(id).subscribe(
            (response: User) => {

                    this.user = response;

                    this.mainForm.patchValue(
                        {
                            idRole:  Number(response.idRole),
                            userName: response.userName,
                            email: response.email,
                            disabled: response.disabled,
                            lockoutEnabled: response.lockoutEnabled,
                            phoneNumber: response.phoneNumber,
                            confirmUrl : globals.confirmUrl,
                            password: response.password,
                            confirmPassword : response.confirmPassword
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
                let isDisabled: boolean = id !== 0;

                let password = new FormControl({ value: '', disabled: isDisabled }, [Validators.required, Validators.minLength(6)]);
                let confirmPassword = new FormControl({ value: '', disabled: isDisabled },
                                                        [Validators.required, Validators.minLength(6),
                                                        CustomValidators.equalTo(password)]);
                this.mainForm = this.fb.group({
                    id: id,
                    idRole:  new FormControl(0, [Validators.required, CustomValidators.min(1)]),
                    userName: new FormControl({ value: '' , disabled: isDisabled },
                                                [Validators.required, Validators.minLength(4)],
                                                this.validateUserName.bind(this)),
                    email: new FormControl({ value: '' , disabled: isDisabled } ,
                                            [Validators.required, Validators.minLength(4),
                                            CustomValidators.email], this.validateEmail.bind(this)),
                    password: password,
                    confirmPassword: confirmPassword,
                    disabled: new FormControl(''),
                    lockoutEnabled: new FormControl(''),
                    phoneNumber :  new FormControl('', [CustomValidators.digits]),
                    confirmUrl : globals.confirmUrl
                });

                this.getModel(id);

            });

            this.subscription.add(formSubscription);

    }

    getAllRoles(): void {

        this.blockUI.start();

        let rolesGetAllSubscription = this._roleService.getEnabledRoles().subscribe(
            (response: Array<Dictionary>) => {

                    this.roles = response;
                    this.blockUI.stop();
            },
            (error: any) => {

                    this._messageAlertHandleService.handleError(error);
                    this.blockUI.stop();
            }
        );

        this.subscription.add(rolesGetAllSubscription);
    }

    validateEmail(control: AbstractControl) {

        const promise = new Promise((resolve) => {

              this._userService.getByEmail(control.value).subscribe(
                (response: User) => {

                    resolve(response.id === 0 ? null : {'isEmailUnique': false} );
              },
              () => { resolve({ 'isEmailUnique': false }); });

          });

          return promise;
    }

    validateUserName(control: AbstractControl) {

        const promise = new Promise((resolve) => {

            this._userService.getByUserName(control.value).subscribe(
                (response: User) => {

                    resolve(response.id === 0 ? null : {'isUserNameUnique': false} );
                },
                 () => {
                    resolve({'isUserNameUnique': false});
                });

        });

        return promise;
    }

    save(): void {

        if (this.mainForm.dirty && this.mainForm.valid) {
            // Copy the form values over the product object values
            let model = Object.assign({}, this.user, this.mainForm.value);

            this.blockUI.start();
            let userSaveSubscription =  this._userService.save(model, Number(model.id)).subscribe(
                () => {
                    // Reset the form to clear the flags
                        const message = this.user.id === 0 ?
                                        'Saved successfully,an verification email was sent to the user' : 'Saved successfully';

                        this._messageAlertHandleService.handleSuccess(message);
                        this.mainForm.reset();
                        this.blockUI.stop();
                        this._router.navigate(['/users']);
                },
                error => {
                    this._messageAlertHandleService.handleError(error);
                    this.blockUI.stop();
                }
             );

            this.subscription.add(userSaveSubscription);
        }
    }
}
