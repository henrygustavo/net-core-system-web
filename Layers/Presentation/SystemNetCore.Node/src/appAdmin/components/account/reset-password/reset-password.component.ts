import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators  } from 'ng2-validation';

import { GenericValidator } from '../../../shared/validators/generic-validator';
import { MessageAlertHandleService } from '../../../shared/services/message-alert-handle.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
    selector: 'reset-password-component',
    templateUrl: './reset-password.component.html'
})
export class ResetPasswordComponent implements OnInit, AfterViewInit, OnDestroy  {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements: ElementRef[] = [];
    displayMessage: { [key: string]: string } = {}
    mainForm: FormGroup;
    validationMessages: { [key: string]: { [key: string]: string } };
    genericValidator: GenericValidator;
    subscription: Subscription = new Subscription();

    constructor(
        private _route: ActivatedRoute,
        private fb: FormBuilder,
        private _messageAlertHandleService: MessageAlertHandleService,
        private _authenticationService: AuthenticationService) {

            this.validationMessages = {
                email: {
                    required: 'Email is required.',
                    minlength: 'Email must be at least 4 characters.',
                    email: 'Please enter a valid email address.'
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

    ngOnInit(): void {

        let password = new FormControl('', [Validators.required, Validators.minLength(6)]);
        let confirmPassword = new FormControl('', [Validators.required, Validators.minLength(6),  CustomValidators.equalTo(password)]);

        const formSubscription = this._route.params.subscribe(
            params => {
                this.mainForm = this.fb.group({
                    email: new FormControl('', [Validators.required, Validators.minLength(4), CustomValidators.email]),
                    password: password,
                    confirmPassword: confirmPassword,
                    token : params['token']
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

   resetPassword(): void {

        this.blockUI.start();

        let resetPasswordSubscription =  this._authenticationService.resetPassword( this.mainForm.value).subscribe(

            (response: string) => {
                                    this._messageAlertHandleService.handleSuccess(response);
                                    this.blockUI.stop(); },
            (error: any) => {
                                   this._messageAlertHandleService.handleError(error);
                                   this.blockUI.stop(); }
            );

        this.subscription.add(resetPasswordSubscription);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
      }
}
