;(function () {

    angular.module('inspinia')
        .controller('ThreadCtrl', ThreadController);

    function ThreadController($scope, ForumService, $state) {
        var self = this;
        self.thread = { owner:{data:{}}};
        self.dirty = {};
        self.editing_thread = false;
        self.threadsLoading = true;
        self. editThread = editThread;
        self.stopThreadEdit = stopThreadEdit;

        activate();

        return self;

        function activate() {
            ForumService.getThread($state.params.thread_slug, 'category,owner,tags').then(function(thread){
                self.thread = thread.data;
            }).finally(function(){
                self.threadsLoading = false;
            });
        }

        function editThread(thread) {
            self.tag_array = thread.tags.data;
            self.editing_thread = true;
        }
        function stopThreadEdit() {
            self.editing_thread = false;
        }
        return self;
    }



})();


