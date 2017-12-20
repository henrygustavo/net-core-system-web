import { Component, OnInit, OnDestroy} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BlockUI, NgBlockUI } from 'ng-block-ui';
import { Subscription } from 'rxjs/Subscription';

import { MessageAlertHandleService } from '../../../shared/services/message-alert-handle.service';
import { AuthenticationService } from '../../../shared/services/authentication.service';
@Component({
    selector: 'verification-email-component',
    templateUrl: './verification-email.component.html'
})
export class VerificationEmailComponent implements OnInit, OnDestroy  {
    @BlockUI() blockUI: NgBlockUI;

    subscription: Subscription = new Subscription();
    responseMessage: String = '';

    constructor(
        private _route: ActivatedRoute,
        private _messageAlertHandleService: MessageAlertHandleService,
        private _authenticationService: AuthenticationService) {

                }

    ngOnInit(): void {

        const veriifcationSubscription = this._route.params.subscribe(
            params => {

                    this.verificationEmail(params['idUser'], params['token']);

            });

         this.subscription.add(veriifcationSubscription);
    }

   verificationEmail(idUser: number, token: string): void {

        this.blockUI.start();

        let verificationTokenSubscription =  this._authenticationService.verificationToken({idUser: idUser, token: token}).subscribe(

            (response: string) => {
                                    this.responseMessage = response;
                                    this.blockUI.stop(); },
            (error: any) => {
                                   this._messageAlertHandleService.handleError(error);
                                   this.blockUI.stop(); }
            );

        this.subscription.add(verificationTokenSubscription);
    }

    ngOnDestroy(): void {
        this.subscription.unsubscribe();
      }
}
