;(function () {

    function ForumController($scope, ForumService, $state) {
        $scope.category = null;
        $scope.threads = [];

        ForumService.getCategory($state.params.category_slug, 'threads.owner,threads.tags').then(function(category){
            $scope.category = category.data;
            $scope.threads = category.data.threads;
            $scope.headerTitle = $scope.category.name;
            $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
                { title: $scope.category.name, link: '#/discussions/' + $scope.category.name }];
        }, function(response){
            console.log(response);
        });

        $scope.more = function() {
            var more = ForumService.next();
            if(more !== null){
                more.then(function(category){
                    if(category.data.threads.data !== null)
                        $scope.threads.data = $scope.threads.data.concat(category.data.threads.data );
                });
            }
        }
    }

    function ThreadFormController($scope, ForumService, toastr, $state, categories, TagService) {
        $scope.thread = {};
        $scope.thread.tag_array = [];
        $scope.categories = categories.data;
        $scope.headerTitle = 'Add new Post';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
            { title: 'Create Topic', link: '#/discussions/new'}];

        $scope.dirty = {};
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

        $scope.removeTag = function(tag) {
            var index = $scope.thread.tag_array.indexOf(tag);
            $scope.thread.tags.data.splice(index, 1);
        };

        $scope.addThread = function(thread) {
            $scope.$broadcast('show-errors-check-validity');

            if ($scope.threadForm.$valid) {
                if(thread.tag_array && thread.tag_array.length > 0) {
                    thread.tags = thread.tag_array.map(function(tag){
                        return tag.name;
                    }).join(",");
                }
                console.log(thread);
                ForumService.addThread(thread).then(function (response) {
                    var thread = response.data.data;
                    toastr.success("'" + thread.title + "' created successfully!", { iconClass: 'toast-comment'});
                    return $state.go("family.forum.thread", {thread_slug: thread.slug});
                });
            }
        };
    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController)
        .controller('ThreadFormCtrl', ThreadFormController);

})();


