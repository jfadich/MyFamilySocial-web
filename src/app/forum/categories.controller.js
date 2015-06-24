;(function () {

    function CategoriesController($scope,categories) {
        $scope.categories = categories;
        $scope.total_posts = categories.meta.total_posts;

    }

    angular.module('inspinia')
        .controller('CategoriesCtrl', CategoriesController);

})();


