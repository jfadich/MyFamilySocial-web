;(function () {

    function AlbumController($scope,albums,api) {
        $scope.albums = [];
        $scope.showEmpty = false;
        $scope.albumLoading = false;
        $scope.pages = {};

        $scope.more = function() {
            if($scope.albumLoading) return;


            if($scope.pages != null && $scope.pages.links != undefined) {
                if($scope.pages.links.next != null) {
                    $scope.albumLoading = true;
                    api.get($scope.pages.links.next).then(function(response) {
                        var album = response.data;
                        if(album !== null)
                            $scope.albums = $scope.albums.concat(album.data );

                        if(album.pagination !== undefined)
                            $scope.pages = album.meta.pagination;
                        else
                            $scope.pages = {};
                    }).finally(function() {
                        $scope.albumLoading = false;
                    });
                }
            }
        };

        $scope.albums = albums.data;
        $scope.pages = albums.meta.pagination;
    }

    function PhotosController($scope,PhotoService,$state,api, $timeout) {
        $scope.album = {  };
        $scope.editing_album = false;
        $scope.highlightImage = $state.params.highlightImage;

        $scope.stopAlbumEdit = function() {
            $scope.editing_album = false;
        };

        $scope.editAlbum = function() {
            $scope.editing_album = true;
        };

        PhotoService.getAlbum($state.params.album, 'owner').then(function(response){
            $scope.album = response.data.data;
        });
    }

    angular.module('inspinia')
        .controller('AlbumCtrl', AlbumController)
        .controller('PhotosCtrl', PhotosController);

})();


