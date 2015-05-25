;(function () {

angular.module('inspinia')
  .controller('MainCtrl', function ($scope, user, auth) {
        var self = this;

        self.getUser = function() {
            user.with('role').getCurrent().then(function(user){
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