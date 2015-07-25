;(function () {

    function ThreadController($scope, ForumService, $state) {
        var self = this;
        self.thread = { owner:{data:{}}};
        self.dirty = {};
        self.editing_thread = false;
        self.threadsLoading = true;
        ForumService.getThread($state.params.thread_slug, 'category,owner,tags').then(function(thread){
            self.thread = thread.data;
        }).finally(function(){
            self.threadsLoading = false;
        });

        self.editThread = function(thread) {
            self.tag_array = thread.tags.data;
            self.editing_thread = true;
        };

        self.stopThreadEdit = function() {
            self.editing_thread = false;
        };

        return self;
    }

    angular.module('inspinia')
        .controller('ThreadCtrl', ThreadController);

})();


