;(function () {

    function ActivityService(api){
        var self = this;

        self.getFeed = function() {
            return api.get(api.url('/activities/'));
        };

    }

    angular.module('inspinia')
        .service('ActivityService', ActivityService);

})();
