;(function () {

    function CommentFeedController($scope, ForumService, toastr) {

        $scope.editReply = function(reply) {
            reply.edited = reply.body;
            $scope.editing = reply.id;
        };

        $scope.saveReply = function(reply) {
            $scope.editing = 0;
            reply.body = reply.edited;
            ForumService.updateReply(reply).then(function(response) {
                toastr.success('Reply updated Successfully', { iconClass: 'toast-comment'});
                reply.edited = undefined;
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
    }

    angular.module('inspinia')
        .controller('CommentFeedCtrl', CommentFeedController);

})();