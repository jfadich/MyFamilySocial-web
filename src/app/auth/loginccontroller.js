;(function () {

    function LoginController($scope, $state, auth, toastr) {
        $scope.credentials = {};
        $scope.newUser = {};
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

        $scope.login_submit = function()
        {
            $scope.$broadcast('show-errors-check-validity');

            if ($scope.login.$valid) {
                auth.login($scope.credentials.email, $scope.credentials.password).then(function(response){
                    $state.go('family.main');console.log('boo')
                }, function(response){
                    toastr.error('Invalid credentials');
                    console.log(response);
                });
            }

        };

        $scope.register_submit = function()
        {
            $scope.$broadcast('show-errors-check-validity');

            if ($scope.register.$valid) {
                auth.register($scope.newUser.first_name, $scope.newUser.last_name, $scope.newUser.email, $scope.newUser.password, $scope.newUser.password_confirm).then(function(response){console.log(response);
                    $state.go('family.main');
                }, function(response){console.log($scope.newUser.first_name, $scope.newUser.last_name, $scope.newUser.email, $scope.newUser.password, $scope.newUser.password_confirm);
                    toastr.error('Invalid input');
                    console.log(response);
                });
            }
        }

    }

    angular.module('inspinia')
        .controller('LoginCtrl', LoginController);

})();
