'use strict';

(function () {
    angular.module('inspinia', [
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ngResource',
        'ui.router',
        'ui.bootstrap',
        'angularMoment',
        'toastr',
        'ui.bootstrap.showErrors',
        'ngSanitize',
        'MassAutoComplete',
        'ncy-angular-breadcrumb'
    ])
    .constant('API_URL', 'http://myfamily.dev')
    .constant('ERRORS', {
            // Authentication
            noToken: 101,
            expiredToken: 102,
            invalidToken:103,
            unauthorized: 104,

            // Resources
            invalidEntity: 201,
            notFound: 202,
            duplicateEntity: 203,
            invalidRelationship: 204
        })
})();