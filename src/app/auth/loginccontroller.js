;(function () {

    function LoginController($scope, user, $location, notify) {
        $scope.credentials = {};
        $scope.errors = [];

        $scope.submit = function()
        {
            user.login($scope.credentials.email, $scope.credentials.password).then(function(response){
                $location.path('/main');
            }, function(response){
                if(response.status === 401){
                    notify('Invalid credentials');
                    $scope.errors = [{message: 'Invalid credentials'}];
                }
                console.log(response);
            });
        }

    }

    angular.module('inspinia')
        .controller('LoginCtrl', LoginController);

})();
