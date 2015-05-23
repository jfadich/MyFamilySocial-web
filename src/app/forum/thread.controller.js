;(function () {

    function ThreadController($scope, ForumService, $state) {
        $scope.thread = null;

        $scope.headerTitle = 'Forum';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];

        ForumService.getThread($state.params.thread_slug).then(function(thread){
            $scope.thread = thread;
            $scope.headerTitle = $scope.thread.title;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.thread.category.data.name, link: '#/discussions/' + $scope.thread.category.data.slug },
                { title: $scope.thread.title, link: ''}];
        }, function(response){
            console.log(response);
        });

    }

    angular.module('inspinia')
        .controller('ThreadCtrl', ThreadController);

})();


