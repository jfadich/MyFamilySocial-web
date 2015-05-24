;(function () {

    function ThreadController($scope, ForumService, $state) {
        $scope.thread = null;

        $scope.headerTitle = 'Forum';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];

        ForumService.with('replies,replies.owner,category,owner').getThread($state.params.thread_slug).then(function(thread){
            $scope.thread = thread.data;
            $scope.headerTitle = $scope.thread.title;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.thread.category.data.name, link: '#/discussions/' + $scope.thread.category.data.slug },
                { title: $scope.thread.title, link: ''}];console.log(thread.replies)
        }, function(response){
            console.log(response);
        });

        $scope.more = function() {
            var more = ForumService.next();
            if(more !== null){
                more.then(function(thread){
                    if(thread.data.replies.data !== null)
                        $scope.thread.replies.data = $scope.thread.replies.data.concat(thread.data.replies.data);
                });

            }
        }

    }

    angular.module('inspinia')
        .controller('ThreadCtrl', ThreadController);

})();


