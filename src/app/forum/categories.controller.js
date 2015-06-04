;(function () {

    function CategoriesController($scope, ForumService, $state) {
        $scope.categories = [];

            $scope.headerTitle = 'Forum';
            $scope.breadcrumbs = [{title: 'Forum', link: 'family.forum.index'}];
            ForumService.getCategories().then(function(categories){
                $scope.categories = categories;
            });

    }


    angular.module('inspinia')
        .controller('CategoriesCtrl', CategoriesController);

})();


