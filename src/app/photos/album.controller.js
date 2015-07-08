;(function () {

    function AlbumController($scope,albums,api) {
        $scope.albums = [];
        $scope.showEmpty = false;
        $scope.pages = {};

        $scope.more = function() {
            var more = $scope.pages.links.next;
            if(more !== null && more != undefined){
                api.get(more).then(function(response){
                    var album = response.data;
                    if(album !== null)
                        $scope.albums = $scope.albums.concat(album.data );

                    if(album.pagination !== undefined)
                        $scope.pages = album.meta.pagination;
                    else
                        $scope.pages = {};
                });
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


