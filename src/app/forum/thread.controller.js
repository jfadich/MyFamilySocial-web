;(function () {

    function ThreadController($scope, ForumService, $state, notify) {
        $scope.thread = null;
        $scope.comment = null;

        $scope.headerTitle = 'Forum';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];

        ForumService.with('replies.owner,category,owner,tags').getThread($state.params.thread_slug).then(function(thread){
            $scope.thread = thread.data;
            $scope.sort();
            $scope.headerTitle = $scope.thread.title;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.thread.title, link: ''}];
        }, function(response){
            console.log(response);
        });

        $scope.addReply = function(comment) {
            ForumService.addReply($scope.thread.slug, comment).then(function(response){
                console.log(response);console.log($scope.thread.replies);
                $scope.sort();
                $scope.thread.replies.data.push(response.data.data);
                $scope.comment = '';
                notify({
                    message: 'Reply added Successfully',
                    classes: 'alert-success'
                });
            }, function(response){
                var message;

                switch(response.status)
                {
                    case 403:
                    case 401:
                        message = 'You aren\'t authorized to do that';
                        break;
                    case 422: message = 'A comment is required';
                        break;
                    default: message = 'An error occurred';
                        break;
                }
                notify({
                    message: message,
                    classes: 'alert-danger'
                });
            })
        };

        $scope.more = function() {
            var more = ForumService.next();
            if(more !== null){
                more.then(function(thread){
                    if(thread.data.replies.data !== null)
                        $scope.thread.replies.data = $scope.thread.replies.data.concat(thread.data.replies.data);
                    $scope.sort();
                });
            }
        };

        $scope.sort = function() {
            function compare(a,b) {
                if (a.created < b.created)
                    return -1;
                if (a.created > b.created)
                    return 1;
                return 0;
            }

            $scope.thread.replies.data.sort(compare);
        }

    }

    angular.module('inspinia')
        .controller('ThreadCtrl', ThreadController);

})();


