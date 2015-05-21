;(function () {

    function ForumController($scope, ForumService) {
        $scope.threads = [];
        $scope.categories = [];

        $scope.headerTitle = 'Forum';

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


