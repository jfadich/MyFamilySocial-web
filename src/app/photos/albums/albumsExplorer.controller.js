;(function () {

    function AlbumsExplorerController(PhotoService, $scope, albums,$state, api, token){
        $scope.showAlbums = true;
        $scope.photoListLoading = true;
        $scope.photosDisplay = 'grid';
        $scope.albums = albums;
        $scope.albums.data = setDownloadLink(albums.data);
        $scope.$on("$stateChangeSuccess", function() {
            $scope.selectedPhoto = null;
            $scope.selectedAlbum = null;
            if($state.params.photo != undefined && $state.params.photo != null) {
                PhotoService.getPhoto($state.params.photo, 'parent').then(function(response){
                    $scope.selectedAlbum = response.data.data.parent.data;
                    setDownloadLink([$scope.selectedAlbum]);
                    $scope.selectedPhoto = response.data.data.id;
                })
            }
            else if($state.params.album != undefined) {
                PhotoService.getAlbum($state.params.album).then(function(response){
                    $scope.selectedAlbum = response.data.data;
                    setDownloadLink([$scope.selectedAlbum]);
                    $scope.selectedPhoto = null;
                });
            }
            else {
                $scope.selectedAlbum = null;
                $scope.selectedPhoto = null;
                PhotoService.getPhotos(null, 'parent',30).then(function(response){
                    $scope.photos = response.data.data;
                    $scope.meta = response.data.meta;
                }).finally(function() {
                    $scope.photoListLoading = false;
                })
            }
        });

        $scope.toggleAlbumList = function() {
            $scope.showAlbums = !$scope.showAlbums;
        };

        $scope.selectAlbum = function(album) {console.log(album);
            $scope.selectedAlbum = album;
        };

        $scope.morePhotoList = function() {
            if($scope.photoListLoading) return;

            if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
                if($scope.meta.pagination.links.next != null) {
                    $scope.photoListLoading = true;
                    return api.get($scope.meta.pagination.links.next).then(function(response) {
                        $scope.photos = $scope.photos.concat(response.data.data);
                        $scope.meta = response.data.meta;
                    }).finally(function() {
                        $scope.photoListLoading = false;
                    });
                }
            }
        };

        function setDownloadLink(albums) {
            albums.forEach(function(album){
                album.downloadLink = api.url('/albums/'+ album.slug + '/download?token='+token.get());
            });
            return albums;
        }
    }

    angular.module('inspinia')
        .controller('AlbumsExplorerCtrl', AlbumsExplorerController);

})();


