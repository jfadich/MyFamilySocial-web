;(function () {

    function ForumController($scope, ForumService, $state) {
        $scope.category = null;
        $scope.threads = [];

        ForumService.with('threads.owner,threads.tags').getCategory($state.params.category_slug).then(function(category){
            $scope.category = category.data;
            $scope.threads = category.data.threads;
            $scope.headerTitle = $scope.category.name;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.category.name, link: '#/discussions/' + $scope.category.name }];
        }, function(response){
            console.log(response);
        });


        $scope.more = function() {
            var more = ForumService.next();
            if(more !== null){
                more.then(function(category){console.log(category);
                    if(category.data.threads.data !== null)
                        $scope.threads.data = $scope.threads.data.concat(category.data.threads.data );
                });
            }
        }

    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController);

})();


