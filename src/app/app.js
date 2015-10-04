'use strict';

(function () {
    angular.module('inspinia', [
        'ngAnimate',
        'ngTouch',
        'ngSanitize',
        'ui.router',
        'ui.bootstrap',
        'angularMoment',
        'toastr',
        'ui.bootstrap.showErrors',
        'ngSanitize',
        'MassAutoComplete',
        'hc.marked',
        'datatables',
        'sticky',
        'infinite-scroll',
        'ngMaterial'
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
        .config(function($mdThemingProvider) {
            $mdThemingProvider.theme('default')
                .primaryPalette('green')
                .accentPalette('brown');
        })
    .config(['markedProvider', function(markedProvider) {
        markedProvider
            .setOptions({gfm: true});
            markedProvider            .setRenderer({
                link: function(href, title, text) {
                    var regX = new RegExp(location.host);
                    if(regX.test(href))
                        return "<a href='" + href + "' title='" + title + "'>" + text + "</a>";

                    return "<a href='" + href + "' title='" + title + "' target='_blank'>" + text + "</a>";
                }
            });
    }])
    .value('THROTTLE_MILLISECONDS', 500); // infinate scroll delay
})();