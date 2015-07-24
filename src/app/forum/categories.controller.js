;(function () {

    function CategoriesController($scope,categories) {
        $scope.categories = categories;
        $scope.total_posts = categories.meta.total_posts;
        $scope.all = {
            id:'all',
            name: 'All Discussions',
            description: 'All categories',
            icon: 'fa fa-asterisk'
        };
        $scope.currentCategory = $scope.all;
        $scope.selectCategory = function(category){
            if(category == 'all')
                $scope.currentCategory = $scope.all;
            else
                $scope.currentCategory = $scope.categories.data[$scope.categories.data.indexOf(category)];
        }
    }

    angular.module('inspinia')
        .controller('CategoriesCtrl', CategoriesController);

})();


