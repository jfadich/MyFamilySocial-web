;(function () {

angular.module('inspinia')
  .controller('MainCtrl', function ($scope, user, auth) {
        var self = this;
        self.getUser = function() {
            user.getUser('~', 'role').then(function(user){
                self.user = user.data;
                $scope.$on('photos.upload.user.'+self.user.id, function(){
                    self.getUser();
                })
            });
        };

        if(auth.isAuthenticated()) {
            self.getUser();
        }
        $scope.$on('USER_LOGGED_IN', function(event, mass) {
            self.getUser();
        });
        $scope.$on('USER_REFRESH', function(event, mass) {
            self.getUser();
        });


        return self;
    });

})();