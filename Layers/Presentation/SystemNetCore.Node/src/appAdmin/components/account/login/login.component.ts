import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/observable/fromEvent';
import 'rxjs/add/observable/merge';
import { Observable } from 'rxjs/Observable';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';
import { CustomValidators  } from 'ng2-validation';
import { AuthService } from 'ng2-ui-auth';

import { AuthenticationService } from '../../../shared/services/authentication.service';
import { GenericValidator } from '../../../shared/validators/generic-validator';
import { MessageAlertHandleService } from '../../../shared/services/message-alert-handle.service';

@Component({
    selector: 'signup-component',
    templateUrl: './login.component.html'
})

export class LoginComponent implements OnInit, AfterViewInit, OnDestroy {
    @BlockUI() blockUI: NgBlockUI;
    @ViewChildren(FormControlName, { read: ElementRef })
     formInputElements: ElementRef[] = [];
     displayMessage: { [key: string]: string } = {};
     mainForm: FormGroup;
     validationMessages: { [key: string]: { [key: string]: string } };
     genericValidator: GenericValidator;
     subscription: Subscription = new Subscription();

    constructor(

        private fb: FormBuilder,
        private _authService: AuthService,
        private _router: Router,
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
            }
        };

        this.genericValidator = new GenericValidator(this.validationMessages);
    }

    ngOnInit(): void {

        this.mainForm = this.fb.group({
            email:  new FormControl('', [Validators.required, Validators.minLength(4), CustomValidators.email]),
            password: new FormControl ('', [Validators.required, Validators.minLength(6)])

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

    signUp(): void {

        this.blockUI.start();

        let signUpSubscription = this._authenticationService.login(this.mainForm.value).subscribe(
            () => {
                this.authLogin();
                this.blockUI.stop();
             },
            error => {
                this._messageAlertHandleService.handleError(error);
                this.blockUI.stop();
            }
        );

        this.subscription.add(signUpSubscription);
    }

    authLogin(): void {

        let authLoginSubscription =  this._authService.login(JSON.stringify(this.mainForm.value)).subscribe({
            error: (err: any) => this._messageAlertHandleService.handleError(err),
            complete: () => this._router.navigateByUrl('dashboard')
        });

        this.subscription.add(authLoginSubscription);
    }
}
