
function CommentFeedController($scope, CommentService, toastr, api, auth) {
    $scope.commentLoading = true;
    $scope.currentUser = auth.currentUser();
    $scope.parentId = 0;

    $scope.addReply = function(comment, event) {
        event.target.disabled = true;
        CommentService.addComment(comment.body, $scope.parent).then(function(response){
            $scope.comments.unshift(response.data);
            toastr.success('Success','Reply added', { iconClass: 'toast-comment'});
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
            toastr.success('Success','Reply updated', { iconClass: 'toast-comment'});
            reply.body = response.data.body;
            reply.updated = response.data.updated;
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
                cancelButtonText: "No, cancel!" },
            function (isConfirm) {
                if (isConfirm) {
                    reply.deleted = true;
                    CommentService.deleteComment(reply.id).then(function(response){
                        var index = $scope.comments.indexOf(reply);
                        $scope.comments.splice(index, 1);
                        toastr.success('Shhhh, you didn\'t see that', 'success', { iconClass: 'toast-comment'});
                        $scope.meta--;
                        return response;

                    }, function(response){
                        reply.deleted = false;
                    });
                }
            });
    };

    $scope.more = function() {
        if($scope.commentLoading || $scope.limit != undefined) return;

        if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
            if($scope.meta.pagination.links.next != null) {
                $scope.commentLoading = true;
                api.get($scope.meta.pagination.links.next).then(function(response) {
                    $scope.comments = $scope.comments.concat(response.data);
                    $scope.meta = response.meta;
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
            CommentService.getComments($scope.parent,$scope.limit).then(function(response) {
                $scope.parentId = $scope.parent.id;
                $scope.comments = response.data;
                $scope.meta = response.meta;
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
                parent: '=parent',
                limit: '=limit'
            },
            controller: CommentFeedController
        }});