;(function () {

    angular.module('MyFamilySocial')
        .factory('CommentService', CommentService);

    function CommentService(api){
        return {
            addComment: addComment,
            getComments: getComments,
            deleteComment: deleteComment,
            updateComment: updateComment
        };

        function addComment(comment, parent) {
            return api.post(api.url('/comments/'), {
                body: comment,
                parent_type: parent.type,
                parent_id: parent.id
            });
        }
        function getComments(parent, limit) {
            if(limit == undefined)
                limit = '';
            else
                limit = "?limit="+limit;
            return api.get(api.url('/comments/'+parent.type+'/'+parent.id+limit))
        }
        function deleteComment(comment) {
            return api.delete(api.url('/comments/') + comment);
        }
        function updateComment(comment) {
            return api.patch(api.url('/comments/') + comment.id, {
                body: comment.body
            });
        }
    }

})();
