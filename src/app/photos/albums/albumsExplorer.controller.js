;(function () {

    function AlbumsExplorerController(PhotoService, $scope, albums,$state){
        $scope.showAlbums = true;
        $scope.photosDisplay = 'grid';
        $scope.albums = albums;
        $scope.$on("$stateChangeSuccess", function() {
            $scope.selectedPhoto = null;
            $scope.selectedAlbum = null;
            if($state.params.photo != undefined && $state.params.photo != null) {console.log($state.params.photo);
                PhotoService.getPhoto($state.params.photo, 'parent').then(function(response){
                    $scope.selectedAlbum = response.data.data.parent.data;
                    $scope.selectedPhoto = response.data.data.id;
                })
            }
            else if($state.params.album != undefined) {
                PhotoService.getAlbum($state.params.album).then(function(response){
                    $scope.selectedAlbum = response.data.data;
                    $scope.selectedPhoto = null;
                });
            }
            else {
                $scope.selectedAlbum = null;
                $scope.selectedPhoto = null;
                PhotoService.getPhotos(null, 'parent',30).then(function(response){
                    $scope.photos = response.data.data;
                })
            }
        });

        $scope.toggleAlbumList = function() {
            $scope.showAlbums = !$scope.showAlbums;
        };

        $scope.selectAlbum = function(album) {console.log(album);
            $scope.selectedAlbum = album;
        }
    }

    angular.module('inspinia')
        .controller('AlbumsExplorerCtrl', AlbumsExplorerController);

})();


