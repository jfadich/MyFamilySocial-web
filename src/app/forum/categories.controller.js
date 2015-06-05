;(function () {

    function CategoriesController($scope,categories) {
        $scope.categories = categories;

    }

    angular.module('inspinia')
        .controller('CategoriesCtrl', CategoriesController);

})();


