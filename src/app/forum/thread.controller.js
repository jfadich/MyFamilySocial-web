;(function () {

    function ThreadController($scope, ForumService, $state, toastr, TagService, categories) {
        $scope.categories = categories.data;
        $scope.thread = null;
        $scope.comment = [];
        $scope.editing = 0;
        $scope.dirty = {};

       // $scope.headerTitle = 'Forum';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];

        ForumService.getThread($state.params.thread_slug, 'replies.owner,category,owner,tags').then(function(thread){
            $scope.thread = thread.data;
            $scope.comments = thread.data.replies.data;
          //  $scope.headerTitle = $scope.thread.title;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.thread.category.data.name, link: ''},
                { title: $scope.thread.title, link: ''}];
        }, function(response){
            console.log(response);
        });

        $scope.addReply = function(comment) {
            ForumService.addReply($scope.thread.slug, comment.body).then(function(response){
                comment.body = '';
                $scope.sort();
                $scope.thread.replies.data.push(response.data.data);
                toastr.success('Reply added Successfully', { iconClass: 'toast-comment'});
            });
        };

        $scope.editThread = function(thread) {console.log(thread);
            thread.tag_array = thread.tags.data;
            $scope.editing_thread = true;
        };

        $scope.stopThreadEdit = function() {
            $scope.editing_thread = false;
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


