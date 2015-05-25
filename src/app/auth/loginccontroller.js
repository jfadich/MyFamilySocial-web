;(function () {

    function LoginController($scope, $state, auth, toastr) {
        $scope.credentials = {};
        $scope.errors = [];

        if($state.current.url == '/logout') {
            auth.logout();
            toastr.success('You are now logged out');
            return $state.go('login');
        }
        else if(auth.isAuthenticated())
        {
            return $state.go('family.main');
        }

        $scope.submit = function()
        {
            auth.login($scope.credentials.email, $scope.credentials.password).then(function(response){
                $state.go('family.main');
            }, function(response){
                console.log(response);
            });
        };

    }

    angular.module('inspinia')
        .controller('LoginCtrl', LoginController);

})();
