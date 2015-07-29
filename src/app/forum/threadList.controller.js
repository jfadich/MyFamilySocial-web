;(function () {

    function ThreadListController($scope, ForumService, $state, api) {
        var self = this;
        self.loading = true;
        if($state.params.category_slug == '' || $state.params.category_slug == 'all') {
            ForumService.getThreads('owner,tags,category').then(function(response){
                self.data = response.data.data;
                self.meta = response.data.meta;
                self.loading = false;
            });
        } else{
            ForumService.getCategory($state.params.category_slug, 'threads.category,threads.owner,threads.tags').then(function(response){
                self.data = response.data.threads.data;
                self.meta = response.data.threads.meta;
                self.loading = false;
            });
        }

        self.more = function() {
            if(self.loading) return;

            if(self.meta.pagination != null && self.meta.pagination.links != undefined) {
                if(self.meta.pagination.links.next != null) {
                    self.loading = true;
                    api.get(self.meta.pagination.links.next).then(function(response) {
                        if($state.params.category_slug == '' || $state.params.category_slug == 'all') {
                            self.data = self.data.concat(response.data.data);
                            self.meta = response.data.meta;
                        }
                        else {
                            self.data = self.data.concat(response.data.data.threads.data);
                            self.meta = response.data.data.threads.meta;
                        }
                    }).finally(function() {
                        self.loading = false;
                    });
                }
            }
        };

        return self;
    }

    angular.module('inspinia')
        .controller('ThreadListCtrl', ThreadListController);

})();