
angular.module('inspinia')

    .directive("commentFeed", function() {
        return {
            templateUrl: "app/comments/commentsFeed.html",
            scope: {
                parent: '=parent'
            },
            controller: "CommentFeedCtrl"
        }});