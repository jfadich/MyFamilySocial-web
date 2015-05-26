;(function () {

    function ThreadController($scope, ForumService, $state, toastr) {
        $scope.thread = null;
        $scope.comment = null;

        $scope.headerTitle = 'Forum';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'}];

        ForumService.getThread($state.params.thread_slug, 'replies.owner,category,owner,tags').then(function(thread){
            $scope.thread = thread.data;
            $scope.headerTitle = $scope.thread.title;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.thread.title, link: ''}];
        }, function(response){
            console.log(response);
        });

        $scope.addReply = function(comment) {
            ForumService.addReply($scope.thread.slug, comment).then(function(response){
                console.log(response);
                $scope.sort();
                $scope.thread.replies.data.push(response.data.data);
                $scope.comment = '';
                toastr.success('Reply added Successfully', 'Success');
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
                toastr.error(message, 'Error');
            })
        };

        $scope.deleteReply = function(reply) {
            if(!confirm('Are you sure you want to delete this reply?'))
                return;
            reply.deleted = true;
            ForumService.deleteReply(reply.id).then(function(response){
                var index = $scope.thread.replies.data.indexOf(reply);
                $scope.thread.replies.data.splice(index, 1);
                toastr.success('Reply delete successfully');
                return response;

            }, function(response){
                reply.deleted = false;
            });
        };

        $scope.more = function() {
            var more = ForumService.next();
            if(more !== null){
                more.then(function(thread){console.log(thread);
                    if(thread.data.replies.data !== null)
                        $scope.thread.replies.data = $scope.thread.replies.data.concat(thread.data.replies.data);
                    $scope.sort();
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


