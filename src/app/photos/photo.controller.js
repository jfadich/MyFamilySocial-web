;(function () {

    function PhotoController($scope,PhotoService, $state) {
        $scope.photo = {};

        PhotoService.getPhoto($state.params.photo, 'owner,tags,parent').then(function(response){
            $scope.photo = response.data;
        })
    }

    angular.module('MyFamilySocial')
        .controller('PhotoCtrl', PhotoController);

})();