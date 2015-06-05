;(function () {

    function AlbumController($scope,PhotoService) {
        $scope.albums = [];
        $scope.showEmpty = false;
        var perCard = 4;

        PhotoService.getAlbums().then(function(response){
            $scope.albums = response.data.data;
            console.log($scope.albums);
        })
    }

    angular.module('inspinia')
        .controller('AlbumCtrl', AlbumController);

})();


