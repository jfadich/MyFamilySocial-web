;(function () {

    function ForumController($scope, ForumService) {
        $scope.threads = [];
        $scope.categories = [];

        $scope.headerTitle = 'Forum';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];

        ForumService.getThreads().then(function(threads){
            $scope.threads = threads;
        });

        ForumService.getCategories().then(function(categories){
            $scope.categories = categories;
        });

    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController);

})();


