;(function () {

    function ThreadController($scope, ForumService, $state, toastr, TagService, categories) {
        $scope.categories = categories.data;
        $scope.thread = { owner:{data:{}}};
        $scope.comment = [];
        $scope.editing = 0;
        $scope.dirty = {};

        ForumService.getThread($state.params.thread_slug, 'replies.owner,category,owner,tags').then(function(thread){
            $scope.thread = thread.data;
            $scope.commentParent = thread.data;
            $scope.comments = thread.data.replies.data;
          //  $scope.headerTitle = $scope.thread.title;
            $scope.breadcrumbs = [{title: 'Forum', link: 'family.forum.index'},
                { title: $scope.thread.category.data.name, link: 'family.forum.category({category_slug: thread.category.data.slug})'},
                { title: $scope.thread.title, link: ''}];
        }, function(response){
            console.log(response);
        });

        $scope.editThread = function(thread) {
            thread.tag_array = thread.tags.data;
            $scope.editing_thread = true;
        };

        $scope.stopThreadEdit = function() {
            $scope.editing_thread = false;
        };


        $scope.more = function() {
            var more = ForumService.next();
            if(more !== null){
                more.then(function(thread){
                    if(thread.data.replies.data !== null)
                        $scope.comments = $scope.comments.concat(thread.data.replies.data);

                    $scope.sort(); // Make sure any new replies are in the correct place relative to the new items
                });
            }
        };

        $scope.sort = function() {
            $scope.thread.replies.data.sort(function(a,b) {
                if (a.created < b.created)
                    return -1;
                if (a.created > b.created)
                    return 1;
                return 0;
            });
        }
    }

    angular.module('inspinia')
        .controller('ThreadCtrl', ThreadController);

})();


