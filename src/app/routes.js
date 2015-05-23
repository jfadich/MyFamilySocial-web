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
                url: '/discussions',
                abstract: true,
                template: '<ui-view/>'
            } )
            .state('family.forum.index', {
                url: "/categories",
                templateUrl: "app/views/forum/categories.html",
                controller: "CategoriesCtrl",
                data: { pageTitle: 'Forum',
                        requireAuth: true
                },
            })
            .state('family.forum.category', {
                url: "/:category_slug",
                templateUrl: "app/views/forum/listThreads.html",
                controller: "ForumCtrl",
                data: { pageTitle: 'category' },
            })
            .state('family.forum.thread', {
                url: "/topics/:thread_slug",
                templateUrl: "app/views/forum/showThread.html",
                controller: "ThreadCtrl",
                data: { pageTitle: 'category' },
            })
            .state('family.members', {
                url: '/members',
                abstract: true,
                template: '<ui-view/>'
            } )
            .state('family.members.index', {
                url: "/index",
                templateUrl: "app/views/users/listUsers.html",
                controller: "UsersCtrl",
                data: { pageTitle: 'Members',
                    requireAuth: true
                },
            })
            .state('login', {
                url: "/login",
                templateUrl: "app/views/auth/login.html",
                controller: "LoginCtrl",
                data: { pageTitle: 'Login' }
            })
            .state('logout', {
                url: "/logout",
                controller: "LoginCtrl"
            });
        $urlRouterProvider.when('/discussions', '/discussions/categories');
        $urlRouterProvider.when('/members', '/members/index');
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