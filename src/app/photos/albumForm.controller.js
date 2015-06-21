
;(function () {

    function AlbumFormController($scope, PhotoService, toastr, $state) {
        if($scope.album === undefined)
            $scope.album = { shared:true };

        $scope.dirty = {};

        $scope.saveAlbum = function(album) {
            $scope.$broadcast('show-errors-check-validity');
            var message = '';
            var promise;
            var toastTitle;console.log($scope.threadForm);
            if ($scope.albumForm.$valid) {

                if(album.id === undefined){
                    promise = PhotoService.addAlbum(album).then(function (response) {
                        var album = response.data.data;
                        toastTitle = album.name.length > 100 ? (album.name.substring(0,100) + '...') : album.name;
                        message = "'" + toastTitle + "' <b>created.</b>";
                        return response
                    });
                }
                else {
                    promise = PhotoService.updateAlbum(album).then(function (response) {
                        var album = response.data.data;
                        toastTitle = album.name.length > 100 ? (album.name.substring(0,100) + '...') : name.title;
                        message = "'" + toastTitle + "' <b>Saved.</b>";
                        return response
                    });
                }

                if(typeof $scope.stopAlbumEdit == 'function')
                    $scope.stopAlbumEdit();

                console.log(album);
                return promise.then(function(response){
                    toastr.success( message, 'Success', {allowHtml: true});
                    console.log( response.data);
                    return $state.go("family.photos.album", {album: response.data.data.slug});
                })
            }
        };
    }

    angular.module('inspinia')
        .controller('AlbumFormCtrl', AlbumFormController)

})();