;(function () {

    function ThreadFormController($scope, ForumService, toastr, $state, TagService) {
        var self = this;

        if(typeof $scope.currentThread != 'object') {
            self.thread = {
                id: 0,
                tags: {
                    data: []
                },
                category: {
                    data: {}
                }
            };
            if( $state.includes('family.forum') && $scope.forum.currentCategory.id != 'all')
                self.thread.category.data.id = $scope.forum.currentCategory.id;
        } else {
            self.thread = $scope.currentThread.thread;
        }
        self.thread.tag_array = typeof self.thread.tags.data !== 'undefined' ? self.thread.tags.data : [];

        self.dirty = {};

        self.tag_autocomplete = {
            suggest: function(search) {
                self.tag_results = [];
                var ix = search.lastIndexOf(','),
                    term = search.substring(ix + 1),
                    terms = search.split(',');
                if(terms.length > 0)
                {
                    for(var i = 0; i < terms.length - 1; i++)
                    {
                        if(terms[i] !== '')
                            self.thread.tag_array.push({name: terms[i]});
                    }
                    self.dirty.value = term;
                }
                if(term == '')
                    return;
                return TagService.search(term).then(function(response){
                    var tags = response.data.data;

                    tags.forEach(function(tag){
                        self.tag_results.push({value: tag.name, label: tag.name});
                    });
                    return self.tag_results;
                });
            },
            on_select: function(selected) {
                self.thread.tag_array.push({name: selected.value});
                self.dirty = {};
            }
        };

        self.removeTag = function(tag) {
            var index = self.thread.tag_array.indexOf(tag);
            self.thread.tag_array.splice(index, 1);
        };

        self.saveThread = function(thread) {
            $scope.$broadcast('show-errors-check-validity');
            var message = '';
            var promise;
            var toastTitle;
            if (self.threadForm.$valid) {

                self.thread.tags = self.thread.tag_array.map(function(tag){
                    return tag.name;
                }).join(",");

                if(self.thread.id === 0){
                    promise = ForumService.addThread(self.thread).then(function (response) {
                        var thread = response.data.data;
                        toastTitle = thread.title.length > 100 ? (thread.title.substring(0,100) + '...') : thread.title;
                        message = "'" + toastTitle + "' <b>created.</b>";
                        return response
                    });
                }
                else {
                    promise = ForumService.updateThread(self.thread).then(function (response) {
                        var thread = response.data.data;
                        toastTitle = thread.title.length > 100 ? (thread.title.substring(0,100) + '...') : thread.title;
                        message = "'" + toastTitle + "' <b>Saved.</b>";
                        return response
                    });
                }

                if(typeof $scope.currentThread == 'object')
                    $scope.currentThread.stopThreadEdit();

                self.thread.tags = { data: self.thread.tag_array };

                return promise.then(function(response){
                    toastr.success( message, 'Success',{ iconClass: 'toast-comment', allowHtml: true});
                    return $state.go("family.forum.category.thread", {thread_slug: response.data.data.slug});
                })
            }
        };
        return self;
    }

    angular.module('inspinia')
        .controller('ThreadFormCtrl', ThreadFormController);

})();