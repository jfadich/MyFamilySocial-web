;(function () {

    function ThreadFormController($scope, ForumService, toastr, $state, TagService) {
        if(typeof $scope.thread != 'object') {
            $scope.thread = {
                tags: {
                    data: []
                }
            }
        }
        $scope.thread.tag_array = typeof $scope.thread.tags.data !== 'undefined' ? $scope.thread.tags.data : [];

        $scope.dirty = {};

        $scope.tag_autocomplete = {
            suggest: function(search) {
                $scope.tag_results = [];
                var ix = search.lastIndexOf(','),
                    term = search.substring(ix + 1),
                    terms = search.split(',');
                if(terms.length > 0)
                {
                    for(var i = 0; i < terms.length - 1; i++)
                    {
                        if(terms[i] !== '')
                            $scope.thread.tag_array.push({name: terms[i]});
                    }
                    $scope.dirty.value = term;
                }
                if(term == '')
                    return;
                return TagService.search(term).then(function(response){
                    var tags = response.data.data;

                    tags.forEach(function(tag){
                        $scope.tag_results.push({value: tag.name, label: tag.name});
                    });
                    return $scope.tag_results;
                });
            },
            on_select: function(selected) {
                $scope.thread.tag_array.push({name: selected.value});
                $scope.dirty = {};
            }
        };

        $scope.removeTag = function(tag) {
            var index = $scope.thread.tag_array.indexOf(tag);
            $scope.thread.tag_array.splice(index, 1);
        };

        $scope.saveThread = function(thread) {
            $scope.$broadcast('show-errors-check-validity');
            var message = '';
            var promise;
            var toastTitle;
            if ($scope.threadForm.$valid) {

                thread.tags = $scope.thread.tag_array.map(function(tag){
                    return tag.name;
                }).join(",");

                if(thread.id === undefined){
                    promise = ForumService.addThread(thread).then(function (response) {
                        var thread = response.data.data;
                        toastTitle = thread.title.length > 100 ? (thread.title.substring(0,100) + '...') : thread.title;
                        message = "'" + toastTitle + "' <b>created.</b>";
                        return response
                    });
                }
                else {
                    promise = ForumService.updateThread(thread).then(function (response) {
                        var thread = response.data.data;
                        toastTitle = thread.title.length > 100 ? (thread.title.substring(0,100) + '...') : thread.title;
                        message = "'" + toastTitle + "' <b>Saved.</b>";
                        return response
                    });
                }

                if(typeof $scope.stopThreadEdit == 'function')
                    $scope.stopThreadEdit();

                thread.tags = { data: $scope.thread.tag_array };

                return promise.then(function(response){
                    toastr.success( message, 'Success',{ iconClass: 'toast-comment', allowHtml: true});
                    console.log( response.data);
                    return $state.go("family.forum.thread", {thread_slug: response.data.data.slug});
                })
            }
        };
    }

    angular.module('inspinia')
        .controller('ThreadFormCtrl', ThreadFormController);

})();