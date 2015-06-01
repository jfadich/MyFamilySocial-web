;(function () {

    function ForumController($scope, ForumService, $state) {
        $scope.category = null;
        $scope.threads = [];

        ForumService.getCategory($state.params.category_slug, 'threads.owner,threads.tags').then(function(category){
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
                more.then(function(category){
                    if(category.data.threads.data !== null)
                        $scope.threads.data = $scope.threads.data.concat(category.data.threads.data );
                });
            }
        }
    }

    function AddThreadController($scope, ForumService, toastr, $state, categories, TagService) {
        $scope.categories = categories.data;
        $scope.headerTitle = 'Add new Post';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
            { title: 'Create Topic', link: '#/discussions/new'}];


    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController)
        .controller('AddThreadCtrl', AddThreadController);

})();


