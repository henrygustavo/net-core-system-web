import {Injectable} from '@angular/core';
import {ToastsManager} from 'ng2-toastr';
import {Response} from '@angular/http';

@Injectable()
export class MessageAlertHandleService {
    constructor(private toastr: ToastsManager) {}

    handleError(err: any) {

        let errorMessage = 'An unknown error has occurred, please try later';

        if (typeof err === 'string') {

            errorMessage = err ;

        } else if (err instanceof Response) {

            let res: Response = err;

            if (res.text() && res.text() !== res.statusText) {

                let errorArray: any[] = JSON.parse(res.text());

                if (errorArray != undefined && errorArray['errors'] != undefined && errorArray['errors'].length > 0) {

                    errorMessage = errorArray['errors'].join('\n');
                }

                if (errorArray != undefined && errorArray['message'] != undefined && errorArray['message'].length > 0) {

                    errorMessage = errorArray['message'];
                }
            }
        }

        this.toastr.error(errorMessage);

    }

    handleSuccess(message: string) {

        this.toastr.success(message);

    }
}
