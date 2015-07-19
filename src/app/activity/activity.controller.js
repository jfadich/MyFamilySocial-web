;(function () {

    function ActivityController($scope,ActivityService, api) {
        var self = this;
        $scope.feed = {};
        $scope.size = 'full';
        $scope.activityLoading = true;

        ActivityService.getFeed().then(function(response){
            $scope.feed = response.data.data;
            $scope.meta = response.data.meta;
        }).finally(function(){
            $scope.activityLoading = false;
        });

        $scope.getActivityBox = function(type) {
            var activityTypes = [
                'created_comment_forumthread',
                'created_comment_photo',
                'created_photo_album',
                'created_forumthread_forumcategory',
                'created_album'
            ];
            if(activityTypes.indexOf(type) > -1)
                return 'app/activity/boxes/'+$scope.size+'/'+type+'.html';

            return '';
        };

        $scope.more = function() {
            if($scope.activityLoading) return;

            if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
                if($scope.meta.pagination.links.next != null) {
                    $scope.activityLoading = true;
                    api.get($scope.meta.pagination.links.next).then(function(response) {
                        $scope.feed = $scope.feed.concat(response.data.data);
                        $scope.meta = response.data.meta;
                    }).finally(function() {
                        $scope.activityLoading = false;
                    });
                }
            }
        };
    }

    angular.module('inspinia')
        .controller('ActivityCtrl', ActivityController)

})();


