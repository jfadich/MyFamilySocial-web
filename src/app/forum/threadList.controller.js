;(function () {

    angular.module('MyFamilySocial')
        .controller('ThreadListCtrl', ThreadListController);

    function ThreadListController($scope, ForumService, $state, api) {
        var self = this;
        self.loading = true;
        self.more = more;

        activate();

        return self;

        function activate() {
            var promise;
            if($state.params.category_slug == '' || $state.params.category_slug == 'all') {
                promise = ForumService.getThreads('owner,tags,category').then(function(response){
                    self.data = response.data;
                    self.meta = response.meta;
                    self.loading = false;
                });
            } else{
                promise = ForumService.getCategory($state.params.category_slug, 'threads.category,threads.owner').then(function(response){
                    self.data = response.data.threads.data;
                    self.meta = response.data.threads.meta;
                    self.loading = false;
                });
            }

            promise.finally(function() {
                self.loading = false;
            })
        }


        function more() {
            if(self.loading || typeof self.meta == 'undefined') return;

            if(self.meta.pagination != null && self.meta.pagination.links != undefined) {
                if(self.meta.pagination.links.next != null) {
                    self.loading = true;
                    api.get(self.meta.pagination.links.next).then(function(response) {
                        if($state.params.category_slug == '' || $state.params.category_slug == 'all') {
                            self.data = self.data.concat(response.data);
                            self.meta = response.data.meta;
                        }
                        else {
                            self.data = self.data.concat(response.data.threads.data);
                            self.meta = response.data.threads.meta;
                        }
                    }).finally(function() {
                        self.loading = false;
                    });
                }
            }
        }
        return self;
    }

})();