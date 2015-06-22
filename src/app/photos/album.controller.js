;(function () {

    function AlbumController($scope,PhotoService) {
        $scope.albums = [];
        $scope.showEmpty = false;
        var perCard = 4;

        PhotoService.getAlbums('photos:limit(4),owner').then(function(response){
            $scope.albums = response.data.data;
            console.log($scope.albums);
        })
    }

    function PhotosController($scope,PhotoService,$state) {
        $scope.album = { photos: {data: [] } };
        $scope.editing_album = false;
        $scope.showEmpty = false;
        $scope.display = 'large';
        var perCard = 4;

        PhotoService.getAlbum($state.params.album, 'photos.owner,photos.tags,owner').then(function(response){
            $scope.album = response.data.data;
        });

        $scope.stopAlbumEdit = function() {
            $scope.editing_album = false;
        };

        $scope.editAlbum = function() {
            $scope.editing_album = true;
        };

        $scope.gallery = function(event) {
            event = event || window.event;
            var target = event.target || event.srcElement,
                link = target.src ? target.parentNode : target,
                options = {index: link, event: event},
                links = event.currentTarget.getElementsByTagName('a');

            blueimp.Gallery(links, options);

        };

        $scope.changeDisplay = function(newDisplay) {
            $scope.display = newDisplay;
        }
    }

    angular.module('inspinia')
        .controller('AlbumCtrl', AlbumController)
        .controller('PhotosCtrl', PhotosController);

})();


