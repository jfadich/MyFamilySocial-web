'use strict';

angular.module('inspinia', ['ngAnimate', 'ngCookies', 'ngTouch', 'ngSanitize', 'ngResource', 'ui.router', 'ui.bootstrap'])
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

        .state('index', {
            abstract: true,
            url: "/index",
            templateUrl: "components/common/content.html",
        })
        .state('index.main', {
            url: "/main",
            templateUrl: "app/views/main.html",
            data: { pageTitle: 'Main' }
        })
        .state('index.minor', {
            url: "/minor",
            templateUrl: "app/views/minor.html",
            data: { pageTitle: 'Test' }
        })
        .state('index.forum', {
            url: "/discussions",
            templateUrl: "app/views/forum/categories.html",
            controller: "ForumCtrl",
            data: { pageTitle: 'Test' }
        })
    $urlRouterProvider.otherwise('/index/main');
  })
;
