;(function () {

    function ProfileController($scope, user, $state, RoleService) {
        $scope.user = [];
        $scope.roles = [];
        $scope.editing = false;

        user.getUser($state.params.user, 'profile_pictures,albums.photos,role').then(function(users){
            if(typeof users.data.birthdate != 'undefined')
                users.data.birthdate = new Date(users.data.birthdate *1000);
            else
                users.data.birthdate = NaN;

            $scope.user = users.data;
        });

        RoleService.getRoles().then(function(response) {
            $scope.roles = response.data.data;
        });

        $scope.saveUser = function (userUpdate) {

            user.updateUser(userUpdate, 'role').then(function(response) {
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