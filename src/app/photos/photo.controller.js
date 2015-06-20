;(function () {

    function PhotoController($scope,PhotoService, $state) {
        $scope.photo = {};
        $scope.comments = [];

        PhotoService.getPhoto($state.params.photo, 'comments.owner,owner,tags,parent').then(function(response){
            $scope.photo = response.data.data;
            $scope.comments = $scope.photo.comments.data;
            console.log($scope.photo);
        })
    }

    angular.module('inspinia')
        .controller('PhotoCtrl', PhotoController);

})();


