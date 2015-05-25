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
            .state('family.forum.createThread', {
                url: "/new",
                templateUrl: "app/views/forum/threadForm.html",
                controller: "ThreadFormCtrl",
                data: { pageTitle: 'Create Topic',
                    requireAuth: true
                }
            })
            .state('family.forum.category', {
                url: "/:category_slug",
                templateUrl: "app/views/forum/listThreads.html",
                controller: "ForumCtrl",
                data: { pageTitle: 'Forum Category',
                    requireAuth: true
                }
            })
            .state('family.forum.thread', {
                url: "/topics/:thread_slug",
                templateUrl: "app/views/forum/showThread.html",
                controller: "ThreadCtrl",
                data: { pageTitle: 'Forum Thread',
                    requireAuth: true
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
                data: { pageTitle: 'Members',
                    requireAuth: true
                },
            })
            .state('family.members.profile', {
                url: "/:user",
                templateUrl: "app/views/users/showProfile.html",
                controller: "ProfileCtrl",
                data: { pageTitle: 'Members',
                    requireAuth: true
                },
            })
            .state('login', {
                url: "/login",
                templateUrl: "app/views/auth/login.html",
                controller: "LoginCtrl",
                data: { pageTitle: 'Login',
                        requireAuth: false
                }
            })
            .state('logout', {
                url: "/logout",
                controller: "LoginCtrl",
                data: { requireAuth: false
                }
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
                closeButton: true,
                tapToDismiss: true
            });
        })
        .run(function($rootScope, $state) {
            $rootScope.$state = $state;
        });

})();