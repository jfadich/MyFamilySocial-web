;(function () {

    function ForumController($scope, ForumService, $state) {
        $scope.category = null;
        $scope.threads = [];

        ForumService.with('threads').getCategory($state.params.category_slug).then(function(category){
            $scope.category = category;
            $scope.threads = category.threads.data;
            $scope.headerTitle = $scope.category.name;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.category.name, link: '#/discussions/' + $scope.category.name }];
        }, function(response){
            console.log(response);
        });

    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController);

})();


