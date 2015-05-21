;(function(){

    function routes($stateProvider, $urlRouterProvider) {
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
            })
            .state('login', {
                url: "/login",
                templateUrl: "app/views/auth/login.html",
                controller: "LoginCtrl",
                data: { pageTitle: 'Login' }
            });

        $urlRouterProvider.otherwise('main');
    }
    angular.module('inspinia')
        .config(routes)
        .run(function($rootScope, $state) {
            $rootScope.$state = $state;
        });

})();