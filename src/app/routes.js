;(function(){

    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('family', {
                abstract: true,
                url: "",
                templateUrl: "components/common/content.html",
                ncyBreadcrumb: {
                    label: 'Family'
                },
                data: {
                    requireAuth: true
                }
            })
            .state('family.home', {
                url: "/home",
                templateUrl: "app/activity/feed.html",
                controller: 'ActivityCtrl',
                data: {
                    pageTitle: 'Welcome'
                }
            })
            .state('family.forum', {
                url: '/discussions',
                abstract: true,
                templateUrl: "app/forum/forum.html",
                controllerAs: "forum",
                controller: "ForumCtrl",
                resolve: {
                    categories: function(ForumService) {
                        return ForumService.getCategories();
                    }
                }
            } )
            .state('family.forum.category.createThread', {
                url: "/new",
                templateUrl: "app/forum/threadForm.html",
                data: {
                    pageTitle: 'Create Topic'
                }
            })
            .state('family.forum.category', {
                url: "/:category_slug",
                controller: 'ThreadListCtrl',
                controllerAs: 'threads',
                templateUrl: "app/forum/threadList.html"
            })
            .state('family.forum.category.thread', {
                url: "/:thread_slug",
                templateUrl: "app/forum/thread.html",
                controllerAs: "currentThread",
                controller: "ThreadCtrl",
                ncyBreadcrumb: {
                    label: '{{currentThread.thread.title}}'
                },
                data: {
                    pageTitle: 'Forum Thread'
                }
            })
            .state('family.forum.index', {
                url: "/categories",
                templateUrl: "app/views/forum/categories.html",
                controller: "CategoriesCtrl",
                ncyBreadcrumb: {
                    label: 'Categories'
                },
                data: {
                    pageTitle: 'Discussion Categories'
                }
            })
            .state('family.members', {
                url: '/members',
                abstract: true,
                ncyBreadcrumb: {
                    label: 'Family'
                },
                template: '<ui-view/>'
            } )
            .state('family.members.index', {
                url: "/index",
                templateUrl: "app/users/user-list.html",
                controller: "UsersCtrl",
                controllerAs: 'userList',
                ncyBreadcrumb: {
                    label: 'Members'
                },
                data: {
                    pageTitle: 'Members'
                }
            })
            .state('family.members.profile', {
                url: "/:user",
                templateUrl: "app/users/profile.show.html",
                controller: "ProfileCtrl",
                controllerAs: "profile",
                data: {
                    pageTitle: '{{ profile.user.display_name }}'
                }
            })
            .state('family.welcome', {
                url: "/welcome",
                templateUrl: "app/welcome/profileWizard.html",
                controller: "ProfileWizardCtrl",
                controllerAs: 'pWiz',
                ncyBreadcrumb: {
                    label: 'Welcome'
                },
                data: {
                    pageTitle: 'Complete your profile'
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
        $urlRouterProvider.when('/discussions', '/discussions/all');
        $urlRouterProvider.when('/members', '/members/index');
        $urlRouterProvider.otherwise('home');
    }
    angular.module('MyFamilySocial')
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