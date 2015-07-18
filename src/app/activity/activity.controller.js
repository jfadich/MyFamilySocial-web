;(function () {

    function ActivityController($scope,ActivityService, PhotoService) {
        var self = this;
        $scope.feed = {};
        $scope.size = 'full';

        ActivityService.getFeed().then(function(response){
            $scope.feed = response.data.data;console.log($scope.feed);
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
    }

    angular.module('inspinia')
        .controller('ActivityCtrl', ActivityController)

})();


