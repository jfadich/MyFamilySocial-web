;(function () {

    function CommentService(api){
        var self = this;

        self.addComment = function(comment, parent)
        {
            return api.post(api.url('/comments/'), {
                body: comment,
                parent_type: parent.type,
                parent_id: parent.id
            });
        };

        self.deleteComment = function(comment) {
            return api.delete(api.url('/comments/') + comment);
        };

        self.updateComment = function(comment) {
            return api.patch(api.url('/comments/') + comment.id, {
                body: comment.body
            });
        };
    }

    angular.module('inspinia')
        .service('CommentService', CommentService);

})();
