;(function(){

    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('family', {
                abstract: true,
                url: "",
                templateUrl: "components/common/content.html",
                'auth' : function(auth){
                    return auth.isAuthenticated();
                }
            })
            .state('family.main', {
                url: "/main",
                templateUrl: "app/views/main.html",
                data: { pageTitle: 'Main' },

            })
            .state('family.forum', {
                url: "/discussions",
                templateUrl: "app/views/forum/categories.html",
                controller: "ForumCtrl",
                data: { pageTitle: 'Forum' },
                resolve: {
                    ForumService: "ForumService"
                }
            })
            .state('family.forum.category', {
                url: "/cat",
                templateUrl: "app/views/forum/listThreads.html",
                controller: "ForumCtrl",
                data: { pageTitle: 'category' },
                resolve: {
                    ForumService: "ForumService"
                }
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