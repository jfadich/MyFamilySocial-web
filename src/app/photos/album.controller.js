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
                        $scope.pages = album.data.photos.meta.pagination;
                    else
                        $scope.pages = {};
                });
            }
        };

        $scope.albums = albums.data;
        $scope.pages = albums.meta.pagination;
    }

    function PhotosController($scope,PhotoService,$state,api, $timeout) {
        $scope.album = { photos: {data: [] } };
        $scope.editing_album = false;
        $scope.showEmpty = false;
        $scope.display = 'gallery';

        //give the image a change to load
        $timeout(function() {
            $scope.targetImage = $state.params.highlightImage;
        },1500);
        //remove the highlight to prevent subviews from redrawing animation
        $timeout(function() {
            $scope.targetImage = 0;
        },3000);


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

            // If the photo that the user is looking for is not in the original request, get it
            var highlight  = $.grep($scope.album.photos.data, function(e){ return e.id == $state.params.highlightImage; });
            if(highlight.length == 0 && $state.params.highlightImage != 0) {
                PhotoService.getPhoto($state.params.highlightImage,'parent').then(function (response) {
                    if(response.data.data.parent.data == $scope.album.id)
                        $scope.album.photos.data.unshift(response.data.data);
                });
            }

            $scope.pages = $scope.album.photos.meta.pagination;
        });
    }

    angular.module('inspinia')
        .controller('AlbumCtrl', AlbumController)
        .controller('PhotosCtrl', PhotosController);

})();


