;(function () {

    function ForumController($scope, ForumService, $location) {
        $scope.threads = [];
        $scope.categories = [];

        $scope.headerTitle = 'Forum';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];

        ForumService.getThreads().
            success(function(threads) {
                $scope.threads = threads.data;
            });

        ForumService.getCategories().
            success(function(categories) {
                $scope.categories = categories.data;
            });
    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController);

})();


