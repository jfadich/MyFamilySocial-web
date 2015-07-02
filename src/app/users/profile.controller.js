;(function () {

    function ProfileController($scope, user, $state) {
        $scope.user = [];
        $scope.editing = true;

        user.getUser($state.params.user, 'profile_pictures,albums.photos,role').then(function(users){
            if(typeof users.data.birthdate != 'undefined')
                users.data.birthdate = new Date(users.data.birthdate *1000);
            else
                users.data.birthdate = NaN;

            $scope.user = users.data;console.log(users.data);
        });

        $scope.saveUser = function (userUpdate) {

            user.updateUser(userUpdate).then(function(response) {
                $scope.editing = false;

                if(typeof response.data.data.birthdate != 'undefined')
                    response.data.data.birthdate = new Date(response.data.data.birthdate *1000);
                else
                    response.data.data.birthdate = NaN;

                $scope.user = response.data.data;
            })
        };

        $scope.edit = function() {
            $scope.editing = true;
        };

        $scope.stopEdit = function() {
            $scope.editing = false;
        }
    }

    angular.module('inspinia')
        .controller('ProfileCtrl', ProfileController);

})();