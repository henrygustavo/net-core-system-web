import {Component, OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/Subscription';
import {AuthService} from 'ng2-ui-auth';

import {MenuItem} from '../models/menu-item';
import {MenuService} from '../services/menu.service';
import {MessageAlertHandleService} from '../../shared/services/message-alert-handle.service';

@Component({selector: 'header-component', templateUrl: './header.component.html'})
export class HeaderComponent implements OnInit,
OnDestroy {

    public menuItems: MenuItem[];
    public selectedMenuItem: string;
    public userName: string;
    private subscription: Subscription = new Subscription();

    constructor(private _messageAlertHandleService: MessageAlertHandleService,
                private _authService: AuthService,
                private _router: Router,
                private _menuService: MenuService,
                private _changeDetectorRef: ChangeDetectorRef) {}

    ngOnInit(): void {

        this.menuItems = this._menuService.getListMenuItems();

        if (this._authService.getPayload() !== undefined) {
            this.userName = this._authService.getPayload().sub;
        }
    }

    ngAfterViewInit(): void {

        let menuSubscription = this._menuService.getSelectedMenuItem()
                                .subscribe(selectedMenuItem => {
                                    this.selectedMenuItem = selectedMenuItem.text;
                                    this._changeDetectorRef.detectChanges();
                                });

        this.subscription.add(menuSubscription);

    }

    ngOnDestroy(): void {

        this.subscription.unsubscribe();
    }

    logOut(): void {

        let logOutSubscription = this._authService.logout().subscribe(
            () => {
                this._router.navigateByUrl('account/login');
             },
            error => {
                this._messageAlertHandleService.handleError(error);
            }
         );

        this.subscription.add(logOutSubscription);
    }
}
