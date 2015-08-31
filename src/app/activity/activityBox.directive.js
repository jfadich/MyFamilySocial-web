(function() {

    angular.module('inspinia')
        .directive("activityBox", activityBox);

    function activityBox() {
        return {
            restrict: 'E',
            templateUrl: "/app/activity/boxes/box.html"
        }
    }
})();