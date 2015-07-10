
function CommentFeedController($scope, CommentService, toastr, api) {
    $scope.commentLoading = false;
$scope.parentId = 0;
    $scope.addReply = function(comment, event) {
        event.target.disabled = true;
        CommentService.addComment(comment.body, $scope.parent).then(function(response){
            $scope.comments.unshift(response.data.data);
            toastr.success('Reply added Successfully', { iconClass: 'toast-comment'});
            comment.body = '';
        });
    };

    $scope.editReply = function(reply) {
        reply.edited = reply.body;
        $scope.editing = reply.id;
    };

    $scope.saveReply = function(reply, event) {
        event.target.disabled = true;
        $scope.editing = 0;

        CommentService.updateComment({ body:reply.edited, id: reply.id }).then(function(response) {
            toastr.success('Reply updated Successfully', { iconClass: 'toast-comment'});
            reply.body = response.data.data.body;
            reply.updated = response.data.data.updated;
        });
    };

    $scope.deleteReply = function(reply) {
        $scope.editing = 0;
        swal({
                title: "Are you sure?",
                text: "Your will not be able to recover this comment!",
                type: "warning",
                showCancelButton: true,
                confirmButtonColor: "#DD6B55",
                confirmButtonText: "Yes, delete it!",
                cancelButtonText: "No, cancel!",
                closeOnConfirm: false,
                closeOnCancel: false },
            function (isConfirm) {
                if (isConfirm) {
                    reply.deleted = true;
                    CommentService.deleteComment(reply.id).then(function(response){
                        var index = $scope.comments.indexOf(reply);
                        $scope.comments.splice(index, 1);
                        swal("Deleted!", "Shhhh, you didn\'t see that", "success");
                        $scope.meta--;
                        return response;

                    }, function(response){
                        reply.deleted = false;
                    });
                } else {
                    swal("Cancelled", "Make up your mind", "error");
                }
            });
    };

    $scope.more = function() {
        if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
            if($scope.meta.pagination.links.next != null) {
                $scope.commentLoading = true;
                api.get($scope.meta.pagination.links.next).then(function(response) {
                    $scope.comments = $scope.comments.concat(response.data.data);
                    $scope.meta = response.data.meta;console.log($scope.comments);
                }).finally(function() {
                    $scope.commentLoading = false;
                });
            }
        }
    };

    $scope.stopEdit = function() {
        $scope.editing = 0;
    };

    $scope.$watch("parent", function() {
        if($scope.parent.type != undefined && $scope.parentId != $scope.parent.id) {
            $scope.commentLoading = true;
            $scope.parentId = 0;
            CommentService.getComments($scope.parent).then(function(response) {
                $scope.parentId = response.data.id;
                $scope.comments = response.data.data;
                $scope.meta = response.data.meta;
            }).finally(function() {
                $scope.commentLoading = false;
            });
        }
    });

    $scope.sort = function() {
        $scope.comments.sort(function(a,b) {
            if (a.created < b.created)
                return -1;
            if (a.created > b.created)
                return 1;
            return 0;
        });
    }
}

angular.module('inspinia')
    .directive("commentFeed", function() {
        return {
            restrict: 'E',
            templateUrl: "app/comments/commentsFeed.html",
            scope: {
                parent: '=parent'
            },
            controller: CommentFeedController
        }});