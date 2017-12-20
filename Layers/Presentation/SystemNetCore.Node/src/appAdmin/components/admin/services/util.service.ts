import {Injectable} from '@angular/core';
import {FormGroup} from '@angular/forms';

import {Dictionary} from '../models/dictionary';

@Injectable()
export class UtilService {
    constructor() {}

    public getSearchCriteria(form: FormGroup): Array < Dictionary > {

        const searchCriteria = new Array < Dictionary > ();

        if (form) {

            const searchFormFields = Object.keys(form.value);

            for (let searchFormField of searchFormFields) {

                searchCriteria.push(new Dictionary(searchFormField, form.value[searchFormField]));
            }
        }
        return searchCriteria;
    }
}
