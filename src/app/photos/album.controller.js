;(function () {

    function AlbumController($scope,PhotoService,api) {
        $scope.albums = [];
        $scope.showEmpty = false;
        $scope.pages = {};
        var perCard = 4;

        $scope.more = function() {
            var more = $scope.pages.links.next;
            if(more !== null && more != undefined){
                api.get(more).then(function(response){
                    var album = response.data;
                    if(album !== null)
                        $scope.albums = $scope.albums.concat(album.data );

                    if(album.pagination !== undefined)
                        $scope.pages = album.data.photos.meta.pagination;
                    else
                        $scope.pages = {};
                });
            }
        };

        PhotoService.getAlbums('photos:limit('+perCard+'),owner').then(function(response){
            $scope.albums = response.data.data;
            $scope.pages = response.data.meta.pagination;
        })
    }

    function PhotosController($scope,PhotoService,$state,api) {
        $scope.album = { photos: {data: [] } };
        $scope.editing_album = false;
        $scope.showEmpty = false;
        $scope.display = 'large';

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
        };

        $scope.more = function() {
            var more = $scope.pages.links.next;
            if(more !== null && more != undefined){
                api.get(more).then(function(response){
                    var album = response.data;
                    if(album !== null)
                        $scope.album.photos.data = $scope.album.photos.data.concat(album.data.photos.data );

                    if(album.pagination !== undefined)
                        $scope.pages = album.data.photos.meta.pagination;
                    else
                        $scope.pages = {};
                });
            }
        };

        PhotoService.getAlbum($state.params.album, 'photos.owner,photos.tags,owner').then(function(response){
            $scope.album = response.data.data;
            $scope.pages = $scope.album.photos.meta.pagination;
        });
    }

    angular.module('inspinia')
        .controller('AlbumCtrl', AlbumController)
        .controller('PhotosCtrl', PhotosController);

})();


