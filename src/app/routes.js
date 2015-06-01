;(function(){

    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('family', {
                abstract: true,
                url: "",
                templateUrl: "components/common/content.html",
                data: {
                    requireAuth: true
                }
            })
            .state('family.main', {
                url: "/main",
                templateUrl: "app/views/main.html",
                data: {
                    pageTitle: 'Main'
                }
            })
            .state('family.forum', {
                url: '/discussions',
                abstract: true,
                template: '<ui-view/>',
                resolve: {
                    categories: function(ForumService) {
                        return ForumService.getCategories();
                    }
                }
            } )
            .state('family.forum.index', {
                url: "/categories",
                templateUrl: "app/views/forum/categories.html",
                controller: "CategoriesCtrl",
                data: {
                    pageTitle: 'Discussion Categories'
                }
            })
            .state('family.forum.createThread', {
                url: "/new",
                templateUrl: "app/views/forum/threadForm.html",
                controller: "AddThreadCtrl",
                data: {
                    pageTitle: 'Create Topic'
                }
            })
            .state('family.forum.category', {
                url: "/:category_slug",
                templateUrl: "app/views/forum/listThreads.html",
                controller: "ForumCtrl",
                data: {
                    pageTitle: 'Forum Category'
                }
            })
            .state('family.forum.thread', {
                url: "/topics/:thread_slug",
                templateUrl: "app/views/forum/showThread.html",
                controller: "ThreadCtrl",
                data: {
                    pageTitle: 'Forum Thread'
                }
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
                data: {
                    pageTitle: 'Members'
                }
            })
            .state('family.members.profile', {
                url: "/:user",
                templateUrl: "app/views/users/showProfile.html",
                controller: "ProfileCtrl",
                data: {
                    pageTitle: 'Members'
                }
            })
            .state('auth', {
                url: '/auth',
                abstract: true,
                templateUrl: 'app/views/auth/auth.html',
                data: {
                    requireAuth: false
                }
            } )
            .state('login', {
                parent: 'auth',
                url: "/login",
                templateUrl: "app/views/auth/login.html",
                controller: "LoginCtrl",
                data: {
                    pageTitle: 'Login'
                }
            })
            .state('register', {
                parent: 'auth',
                url: "/register",
                templateUrl: "app/views/auth/register.html",
                controller: "LoginCtrl",
                data: {
                    pageTitle: 'Register'
                }
            })
            .state('logout', {
                parent: 'auth',
                url: "/logout",
                controller: "LoginCtrl"
            });
        $urlRouterProvider.when('/discussions', '/discussions/categories');
        $urlRouterProvider.when('/members', '/members/index');
        $urlRouterProvider.otherwise('main');
    }
    angular.module('inspinia')
        .config(routes)
        .config(function(toastrConfig) {
            angular.extend(toastrConfig, {

                progressBar: true,
                tapToDismiss: true
            });
        })
        .run(function($rootScope, $state) {
            $rootScope.$state = $state;
        });

})();