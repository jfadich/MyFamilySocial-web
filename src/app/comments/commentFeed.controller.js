;(function () {

    function CommentFeedController($scope, ForumService, toastr) {

        $scope.editReply = function(reply) {
            reply.edited = reply.body;
            $scope.editing = reply.id;
        };

        $scope.saveReply = function(reply) {
            reply.body = reply.edited;
            reply.edited = undefined;
            ForumService.updateReply(reply).then(function(response) {
                $scope.editing = 0;
                toastr.success('Reply updated Successfully', { iconClass: 'toast-comment'});
            });
        };

        $scope.deleteReply = function(reply) {
            $scope.editing = 0;
            if(!confirm('Are you sure you want to delete this reply?')) return;

            reply.deleted = true;
            ForumService.deleteReply(reply.id).then(function(response){
                var index = $scope.comments.indexOf(reply);
                $scope.comments.splice(index, 1);
                toastr.success('Shhhh, you didn\'t see that', 'Reply deleted successfully');
                return response;

            }, function(response){
                reply.deleted = false;
            });
        };

        $scope.stopEdit = function() {
            $scope.editing = 0;
        };

        $scope.more = function() {
            var more = ForumService.next();console.log($scope.thread.replies.meta.pagination);
            if(more !== null){
                more.then(function(thread){console.log(thread);
                    if(thread.data.replies.data !== null)
                        $scope.comments = $scope.comments.concat(thread.data.replies.data);
                });
            }
        };
    }

    angular.module('inspinia')
        .controller('CommentFeedCtrl', CommentFeedController);

})();