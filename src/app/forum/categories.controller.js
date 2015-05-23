;(function () {

    function CategoriesController($scope, ForumService, $state) {
        $scope.categories = [];

            $scope.headerTitle = 'Forum';
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];
            ForumService.with('threads').getCategories().then(function(categories){
                $scope.categories = categories;
            });

    }


    angular.module('inspinia')
        .controller('CategoriesCtrl', CategoriesController);

})();


