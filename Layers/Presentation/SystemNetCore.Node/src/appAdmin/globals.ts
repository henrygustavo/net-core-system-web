'use strict';


var localHostUrl = window.location.origin || window.location.protocol + '//' + window.location.host;

export var apiURL = 'http://localhost:60041/api/';
export var resetUrl = localHostUrl + '/admin.html#/account/reset-password';
export var confirmUrl = localHostUrl + '/admin.html#/account/verification-email';
