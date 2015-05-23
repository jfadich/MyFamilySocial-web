;(function () {

    function LoginController($scope, user, $location, auth,$state, notify) {
        $scope.credentials = {};
        $scope.errors = [];

        $scope.submit = function()
        {
            user.login($scope.credentials.email, $scope.credentials.password).then(function(response){
                $location.path('/main');
            }, function(response){
                if(response.status === 401){
                    $scope.errors = [{message: 'Invalid credentials'}];
                }
                console.log(response);
            });
        };

        if($state.current.url == '/logout') {
            auth.logout();
            notify({
                message: 'You are now logged out',
                position: 'center',
                classes: 'alert-success'
            });
            $location.path('/login');
        }
    }

    angular.module('inspinia')
        .controller('LoginCtrl', LoginController);

})();
