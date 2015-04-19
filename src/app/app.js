'use strict';

angular.module('inspinia', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('master', {
            abstract: true,
            url: "",
            templateUrl: "components/common/content.html",
        })
        .state('master.main', {
            url: "/main",
            templateUrl: "app/views/main.html",
            data: { pageTitle: 'Main' }
        })
        .state('master.forum', {
            url: "/discussions",
            templateUrl: "app/views/forum/categories.html",
            controller: "ForumCtrl",
            data: { pageTitle: 'Test' }
        });

    $urlRouterProvider.otherwise('main');
  })
;
