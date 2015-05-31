;(function () {

    function ThreadController($scope, ForumService, $state, toastr, TagService, categories) {
        $scope.categories = $scope.categories = categories.data;
        $scope.thread = null;
        $scope.comment = null;
        $scope.editing = 0;
        $scope.dirty = {};

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
            ForumService.addReply($scope.thread.slug, comment.body).then(function(response){
                comment.body = '';
                $scope.sort();
                $scope.thread.replies.data.push(response.data.data);
                toastr.success('Reply added Successfully', { iconClass: 'toast-comment'});
            });
        };

        $scope.editReply = function(reply) {
            reply.edited = reply.body;
            $scope.editing = reply.id;
        };

        $scope.stopEdit = function() {
            $scope.editing = 0;
        };

        $scope.editThread = function(thread) {console.log(thread);
            thread.tag_array = thread.tags.data;
            thread.edited = thread.body;
            $scope.editing_thread = true;
        };
        $scope.tag_autocomplete = {
            suggest: function(search) {
                $scope.results = [];
                var ix = search.lastIndexOf(','),
                    term = search.substring(ix + 1),
                    terms = search.split(',');
                if(terms.length > 0)
                {
                    for(var i = 0; i < terms.length - 1; i++)
                    {
                        if(terms[i] !== '')
                            $scope.thread.tag_array.push({name: terms[i]});

                        $scope.dirty.value = term;
                    }
                }
                if(term == '')
                    return;
                return TagService.search(term).then(function(response){
                    var tags = response.data.data;

                    tags.forEach(function(tag){
                        $scope.results.push({value: tag.name, label: tag.name});
                    });
                    return $scope.results;
                });
            },
            on_select: function(selected) {
                $scope.thread.tag_array.push({name: selected.value});
                $scope.dirty = {};
            }
        };

        $scope.stopEdit = function() {
            $scope.editing = 0;
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


