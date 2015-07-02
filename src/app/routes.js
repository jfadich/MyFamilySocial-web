;(function(){

    function routes($stateProvider, $urlRouterProvider) {
        $stateProvider

            .state('family', {
                abstract: true,
                url: "",
                templateUrl: "components/common/content.html",
                ncyBreadcrumb: {
                    label: 'Home page'
                },
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
                ncyBreadcrumb: {
                    label: 'Forum'
                },
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
                ncyBreadcrumb: {
                    label: 'Categories'
                },
                data: {
                    pageTitle: 'Discussion Categories'
                }
            })
            .state('family.forum.createThread', {
                url: "/new",
                templateUrl: "app/views/forum/threadForm.html",
                controller: "AddThreadCtrl",
                ncyBreadcrumb: {
                    label: 'Create New Topic'
                },
                data: {
                    pageTitle: 'Create Topic'
                }
            })
            .state('family.forum.category', {
                url: "/:category_slug",
                templateUrl: "app/views/forum/listThreads.html",
                ncyBreadcrumb: {
                    label: '{{category.name}}'
                },
                controller: "ForumCtrl",
                data: {
                    pageTitle: 'Forum Category'
                }
            })
            .state('family.forum.thread', {
                url: "/topics/:thread_slug",
                templateUrl: "app/views/forum/showThread.html",
                controller: "ThreadCtrl",
                ncyBreadcrumb: {
                    label: '{{ thread.category.data.name}} / {{thread.title}}'
                },
                data: {
                    pageTitle: 'Forum Thread'
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
                templateUrl: "app/views/users/listUsers.html",
                controller: "UsersCtrl",
                ncyBreadcrumb: {
                    label: 'Members'
                },
                data: {
                    pageTitle: 'Members'
                }
            })
            .state('family.members.profile', {
                url: "/:user",
                templateUrl: "app/views/users/showProfile.html",
                controller: "ProfileCtrl",
                ncyBreadcrumb: {
                    label: '{{ user.display_name }}'
                },
                data: {
                    pageTitle: 'Members'
                }
            })
            .state('family.members.edit', {
                url: "/:user",
                templateUrl: "app/views/users/editProfile.html",
                controller: "ProfileCtrl",
                ncyBreadcrumb: {
                    label: '{{ user.display_name }}'
                },
                data: {
                    pageTitle: 'Members'
                }
            })
            .state('family.photos', {
                url: '/photos',
                abstract: true,
                ncyBreadcrumb: {
                    label: 'Family Photos'
                },
                resolve: {
                    albums: function (PhotoService) {
                        return PhotoService.getAlbums('photos:limit(4),owner').then(function(response){
                            return response.data;
                        });
                    }
                },
                template: '<ui-view/>'
            } )
            .state('family.photos.albums', {
                url: "",
                templateUrl: "app/views/photos/albums.html",
                controller: "AlbumCtrl",
                ncyBreadcrumb: {
                    label: 'Albums'
                },
                data: {
                    pageTitle: 'Photos'
                }
            })
            .state('family.photos.createAlbum', {
                url: "/new",
                templateUrl: "app/views/photos/createAlbum.html",
                ncyBreadcrumb: {
                    label: 'Create New Photo Album'
                },
                data: {
                    pageTitle: 'Create Photo Album'
                }
            })
            .state('family.photos.album', {
                url: "/albums/:album",
                templateUrl: "app/views/photos/showAlbum.html",
                controller: "PhotosCtrl",
                params: { highlightImage: 0 },
                ncyBreadcrumb: {
                    label: '{{ album.name }}'
                },
                data: {
                    pageTitle: 'Photos'
                }
            })
            .state('family.photos.album.explore', {
                url: "/albums/:album/:photo",
                templateUrl: "app/views/photos/showAlbum.html",
                controller: "PhotosCtrl",
                params: { highlightImage: 0 },
                ncyBreadcrumb: {
                    label: '{{ album.name }}'
                },
                data: {
                    pageTitle: '{{ album.name }}'
                }
            })
            .state('family.photos.photo', {
                url: "/:photo",
                templateUrl: "app/views/photos/showPhoto.html",
                controller: "PhotoCtrl",
                ncyBreadcrumb: {
                    label: '{{ photo.parent.data.name }} / {{ photo.name }}'
                },
                data: {
                    pageTitle: 'Photos'
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
        $urlRouterProvider.otherwise(function($injector, $location) {
            var $state = $injector.get("$state");
            $state.go("family.main");
        });
    }
    angular.module('inspinia')
        .config(routes)
        .config(function($breadcrumbProvider) {
            $breadcrumbProvider.setOptions({
                includeAbstract: 'true'
            });
        })
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