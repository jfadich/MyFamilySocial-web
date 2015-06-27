;(function () {

    function PhotoController($scope,PhotoService, $state) {
        $scope.photo = {};

        PhotoService.getPhoto($state.params.photo, 'owner,tags,parent').then(function(response){
            $scope.photo = response.data.data;
        })
    }

    angular.module('inspinia')
        .controller('PhotoCtrl', PhotoController);

})();


