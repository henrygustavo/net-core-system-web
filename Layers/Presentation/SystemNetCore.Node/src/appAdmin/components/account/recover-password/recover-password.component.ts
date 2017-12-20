import { Component, OnInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators  } from 'ng2-validation';

import { GenericValidator } from '../../../shared/validators/generic-validator';
import { MessageAlertHandleService } from '../../../shared/services/message-alert-handle.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';

import * as globals from '../../../globals';

@Component({
    selector: 'recover-password-component',
    templateUrl: './recover-password.component.html'
})
export class RecoverPasswordComponent implements OnInit, OnDestroy {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChildren(FormControlName, { read: ElementRef })
    formInputElements: ElementRef[]= [];
    displayMessage: { [key: string]: string } = {};
    mainForm: FormGroup;
    validationMessages: { [key: string]: { [key: string]: string } };
    genericValidator: GenericValidator;
    subscription: Subscription = new Subscription();

    constructor(
        private fb: FormBuilder,
        private _messageAlertHandleService: MessageAlertHandleService,
        private _authenticationService: AuthenticationService) {

            this.validationMessages = {
                email: {
                    required: 'Email is required.',
                    minlength: 'Email must be at least 4 characters.',
                    email: 'Please enter a valid email address.'
                }
            };
            this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit(): void  {
        this.mainForm = this.fb.group({
            email: new FormControl('', [Validators.required, Validators.minLength(4), CustomValidators.email]),
            resetUrl : globals.resetUrl
        });
    }

    ngAfterViewInit(): void {

        let controlBlurs: Observable<any>[] = this.formInputElements
            .map((formControl: ElementRef) => Observable.fromEvent(formControl.nativeElement, 'blur'));

        let controlSubscription =  Observable.merge(this.mainForm.valueChanges, ...controlBlurs).debounceTime(800).subscribe(() => {
            this.displayMessage = this.genericValidator.processMessages(this.mainForm);
        });

        this.subscription.add(controlSubscription);
    }

    ngOnDestroy(): void {

        this.subscription.unsubscribe();
    }

    recoverPassword(): void {

        this.blockUI.start();

        let recoverPasswordSubscription = this._authenticationService.recoverPassword(this.mainForm.value).subscribe(
            (response: string) => {
                this._messageAlertHandleService.handleSuccess(response);
                this.blockUI.stop();
             },
            (error: any) => {
                this._messageAlertHandleService.handleError(error);
                this.blockUI.stop();
            }
        );

        this.subscription.add(recoverPasswordSubscription);
    }
}
