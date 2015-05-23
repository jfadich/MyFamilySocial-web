;(function () {

angular.module('inspinia')
  .controller('MainCtrl', function ($scope, user, auth, notify) {
        var self = this;
        notify.config({
            templateUrl: 'components/common/notify.html',
            position: 'right'
        });

        self.getUser = function() {
            user.getCurrent().then(function(user){
                self.user = user;
            });
        };

        if(auth.isAuthenticated()) {
            self.getUser();
        }
        $scope.$on('USER_LOGGED_IN', function(event, mass) {
            self.getUser();
        });

        $scope.headerTitle = "Home";

    });

})();