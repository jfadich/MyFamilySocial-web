;(function () {

    function ProfileController($scope, UserService, $state, RoleService) {
        $scope.user = [];
        $scope.roles = [];
        $scope.editing = false;

        UserService.getUser($state.params.user, 'profile_pictures,albums.photos,role').then(function(users){
            if(typeof users.data.birthdate != 'undefined')
                users.data.birthdate = new Date(users.data.birthdate *1000);
            else
                users.data.birthdate = NaN;

            $scope.user = users.data;


            $scope.$on('photos.upload.user.' + $scope.user.id, function(event, data){console.log(data);
                $scope.user.image= data.image;
            });
        });

        RoleService.getRoles().then(function(response) {
            $scope.roles = response.data.data;
        });

        $scope.saveUser = function (userUpdate) {

            UserService.updateUser(userUpdate, 'profile_pictures,albums.photos,role').then(function(response) {
                $scope.editing = false;

                if(typeof response.data.birthdate != 'undefined')
                    response.data.birthdate = new Date(response.data.data.birthdate *1000);
                else
                    response.data.birthdate = NaN;

                $scope.user = response.data;
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