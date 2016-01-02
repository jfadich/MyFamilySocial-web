
;(function () {

    function AlbumFormController($scope, PhotoService,AlbumService, toastr, $state) {
        if($scope.album === undefined)
            $scope.album = { shared:true };

        $scope.dirty = {};

        $scope.saveAlbum = function(album) {
            $scope.$broadcast('show-errors-check-validity');
            var message = '';
            var promise;
            var toastTitle;
            if ($scope.albumForm.$valid) {

                if(album.id === undefined){
                    promise = AlbumService.addAlbum(album).then(function (response) {
                        var album = response.data;
                        toastTitle = album.name.length > 100 ? (album.name.substring(0,100) + '...') : album.name;
                        message = "'" + toastTitle + "' <b>created.</b>";
                        return response
                    });
                }
                else {
                    promise = AlbumService.updateAlbum(album).then(function (response) {
                        var album = response.data;console.log(response);
                        toastTitle = album.name.length > 100 ? (album.name.substring(0,100) + '...') : album.name;
                        message = "'" + toastTitle + "' <b>Saved.</b>";
                        return response
                    });
                }

                if(typeof $scope.stopAlbumEdit == 'function')
                    $scope.stopAlbumEdit();

                return promise.then(function(response){
                    toastr.success( message, 'Success', {allowHtml: true});
                    // $state.go("family.photos.albums.album", {album: response.data.slug});
                })
            }
        };
    }

    angular.module('MyFamilySocial')
        .controller('AlbumFormCtrl', AlbumFormController)

})();