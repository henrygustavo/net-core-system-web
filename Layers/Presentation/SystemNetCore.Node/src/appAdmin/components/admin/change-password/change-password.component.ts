import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { GenericValidator } from '../../../shared/validators/generic-validator';
import { MessageAlertHandleService } from '../../../shared/services/message-alert-handle.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
import { Router, ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators  } from 'ng2-validation';
import { AuthService } from 'ng2-ui-auth';

import { MenuService } from '../../../shared/services/menu.service';

@Component({
    selector: 'change-password.component',
    templateUrl: './change-password.component.html'
})
export class ChangePasswordComponent implements OnInit, AfterViewInit, OnDestroy  {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements: ElementRef[] = [];
    displayMessage: { [key: string]: string } = {};
    mainForm: FormGroup;
    validationMessages: { [key: string]: { [key: string]: string } };
    genericValidator: GenericValidator;
    subscription: Subscription = new Subscription();

    constructor(
        private _route: ActivatedRoute,
        private fb: FormBuilder,
        private _router: Router,
        private _messageAlertHandleService: MessageAlertHandleService,
        private _authenticationService: AuthenticationService,
        private _authService: AuthService,
        private _menuService: MenuService) {

            this.validationMessages = {
                oldPassword: {
                    required: 'Old Password is required.',
                    minlength: 'Old Password  must be least 6 characters.',
                },
                newPassword: {
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

    ngOnInit(): void {

        this._menuService.selectMenuItem('');

        let newPassword = new FormControl('', [Validators.required, Validators.minLength(6)]);
        let certainPassword = new FormControl('', [Validators.required, Validators.minLength(6),  CustomValidators.equalTo(newPassword)]);

        const formSubscription = this._route.params.subscribe(
            () => {
                this.mainForm = this.fb.group({
                    oldPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
                    newPassword: newPassword,
                    confirmPassword: certainPassword
                });
            });

         this.subscription.add(formSubscription);
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

    changePassword(): void {

        this.blockUI.start();

        let changePasswordSubscription =  this._authenticationService.changePassword( this.mainForm.value).subscribe(

            (response: string) => {
                              this._messageAlertHandleService.handleSuccess(response);
                              this.blockUI.stop(); this.logOut(); },
            (error: any) => {
                              this._messageAlertHandleService.handleError(error);
                              this.blockUI.stop(); }
            );

        this.subscription.add(changePasswordSubscription);
    }

    logOut(): void {

        let logOutSubscription = this._authService.logout().subscribe(
                () => { this._router.navigateByUrl('account/login'); },
                error => { this._messageAlertHandleService.handleError(error); }
             );

        this.subscription.add(logOutSubscription);
     }
}
