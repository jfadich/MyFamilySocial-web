;(function(){

    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('family', {
                abstract: true,
                url: "",
                templateUrl: "components/common/content.html",

            })
            .state('family.main', {
                url: "/main",
                templateUrl: "app/views/main.html",
                data: { pageTitle: 'Main',
                        requireAuth: true
                }
            })
            .state('family.forum', {
                url: "/discussions",
                templateUrl: "app/views/forum/categories.html",
                controller: "ForumCtrl",
                data: { pageTitle: 'Forum',
                        requireAuth: true
                },
            })
            .state('family.forum.category', {
                url: "/cat",
                templateUrl: "app/views/forum/listThreads.html",
                controller: "ForumCtrl",
                data: { pageTitle: 'category' },
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
        .run(function($rootScope, $state, auth) {
            $rootScope.$state = $state;
            $rootScope.$on('$stateChangeStart',
                function(event, toState, toParams, fromState, fromParams){
                    if(toState.data.requireAuth === true)
                    {
                        if(!auth.isAuthenticated()){
                            event.preventDefault();
                            return $state.go('login');
                        }
                    }
                })
        });

})();