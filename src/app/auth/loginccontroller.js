;(function () {

    function LoginController($scope, user, $location) {
        $scope.user = {};

        $scope.submit = function()
        {
            user.login($scope.user.email, $scope.user.password).then(function(response){
                $location.path('/main');
            }, function(response){
                alert('nope');
            });
        }

    }

    angular.module('inspinia')
        .controller('LoginCtrl', LoginController);

})();
