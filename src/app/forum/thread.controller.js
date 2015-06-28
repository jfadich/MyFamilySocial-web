;(function () {

    function ThreadController($scope, ForumService, $state, categories) {
        $scope.categories = categories.data;
        $scope.thread = { owner:{data:{}}};
        $scope.dirty = {};
        $scope.editing_thread = false;

        ForumService.getThread($state.params.thread_slug, 'category,owner,tags').then(function(thread){
            $scope.thread = thread.data;
        });

        $scope.editThread = function(thread) {
            thread.tag_array = thread.tags.data;
            $scope.editing_thread = true;
        };

        $scope.stopThreadEdit = function() {
            $scope.editing_thread = false;
        };
    }

    angular.module('inspinia')
        .controller('ThreadCtrl', ThreadController);

})();


