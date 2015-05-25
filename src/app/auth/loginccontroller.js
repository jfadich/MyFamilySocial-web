;(function () {

    function LoginController($scope, user, $state, auth,$state, toastr) {
        $scope.credentials = {};
        $scope.errors = [];

        $scope.submit = function()
        {
            user.login($scope.credentials.email, $scope.credentials.password).then(function(response){
                $state.go('family.main');
            }, function(response){
                if(response.status === 401){
                    toastr.error('Invalid credentials');
                }
                console.log(response);
            });
        };

        if($state.current.url == '/logout') {
            auth.logout();
            toastr.success('You are now logged out');
            $state.go('login');
        }
    }

    angular.module('inspinia')
        .controller('LoginCtrl', LoginController);

})();
