import { CustomConfig } from 'ng2-ui-auth';
import * as globals from './globals';

export const GOOGLE_CLIENT_ID = 'XXXXX';

export class AuthConfig extends CustomConfig {
    defaultHeaders = { 'Content-Type': 'application/json' };
    providers = { google: { clientId: GOOGLE_CLIENT_ID } };
    loginUrl = globals.apiURL + '/auth/token';
    tokenPrefix = '';
    tokenName = 'access_token';
}
