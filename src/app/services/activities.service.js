;(function () {

    angular.module('inspinia')
        .factory('ActivityService', ActivityService);

    function ActivityService(api){
        return {
            getFeed:getFeed
        };

        function getFeed() {
            return api.get(api.url('/activities/?count=5'));
        }
    }

})();
