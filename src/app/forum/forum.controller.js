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
                more.then(function(category){
                    if(category.data.threads.data !== null)
                        $scope.threads.data = $scope.threads.data.concat(category.data.threads.data );
                });
            }
        }

    }

    function ThreadFormController($scope, ForumService, toastr, $state) {
        $scope.thread = null;
        $scope.categories = [];
        $scope.headerTitle = 'Add new Post';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
            { title: 'Create Topic', link: '#/discussions/new'}];

        $scope.addThread = function(thread) {
            if(thread === null || !thread.title || !thread.category || ! thread.body ){
                toastr.error('Please fill in all fields');
                return;
            }

            ForumService.addThread(thread).then(function(response){
                var thread = response.data.data;console.log(thread);
                toastr.success("'"+thread.title+"' created successfully!");
                return $state.go("family.forum.thread",{thread_slug: thread.slug});
            });
        };

        ForumService.getCategories().then(function(category){
            $scope.categories = category.data;
        }, function(response){
            console.log(response);
        });
    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController)
        .controller('ThreadFormCtrl', ThreadFormController);

})();


