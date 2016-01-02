;(function(){

    function PhotoRoutes($stateProvider) {
        $stateProvider
            .state('family.photos', {
                url: '/photos',
                abstract: true,
                controller: 'PhotoMasterCtrl',
                controllerAs: 'photoMaster',
                resolve: {
                    albums: function (AlbumService) {
                        return AlbumService.getAlbum('');
                    }
                },
                templateUrl: "app/photos/photos.html",
                //template: '<ui-view></ui-view>'
            } )
            .state('family.photos.album', {
                url: "/albums/:album",
                templateUrl: "app/photos/photoList.html",

                data: {
                    pageTitle: 'Photos'
                }
            })
            .state('family.photos.all', {
                    url: "/",
                    templateUrl: "app/photos/photoList.html",
                    data: {
                        pageTitle: 'Photos'
                    }
                });
        /*
            .state('family.photos.albums', {
                url: "/albums",
                templateUrl: "app/photos/albums/index.html",
                controller: 'AlbumsExplorerCtrl',
                controllerAs: 'albumExplorer',
                resolve: {
                    albums: function (AlbumService) {
                        return AlbumService.getAlbum('');
                    }
                },
                data: {
                    pageTitle: 'Photos'
                }
            })
            .state('family.photos.createAlbum', {
                url: "/new",
                templateUrl: "app/views/photos/createAlbum.html",
                data: {
                    pageTitle: 'Create Photo Album'
                }
            })
            .state('family.photos.album', {
                url: "/albumsOld/:album",
                templateUrl: "app/views/photos/showAlbum.html",
                controller: "PhotosCtrl",
                params: { highlightImage: 0 },
                data: {
                    pageTitle: 'Photos'
                }
            })
*/
    }
    angular.module('MyFamilySocial')
        .config(PhotoRoutes)

})();