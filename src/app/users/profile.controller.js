;(function () {

    angular.module('inspinia')
        .controller('ProfileCtrl', ProfileController);

    function ProfileController($scope, UserService, $state, RoleService, toastr) {
        var self = this;
        self.user = [];
        self.roles = [];
        self.editing = false;
        self.saveUser = saveUser;

        activate();

        return self;

        function activate() {
            UserService.getUser($state.params.user, 'profile_pictures,albums.photos,role').then(function(users){
                self.user = users.data;
                if(typeof self.user.birthdate != 'undefined')
                    self.user.birthdate = new Date(self.user.birthdate *1000);
                else {
                    self.user.birthdate = NaN;

                }

                $scope.$on('photos.upload.user.' + self.user.id, function(event, data){
                    self.user.image= data.image;
                });
            });

            RoleService.getRoles().then(function(response) {
                self.roles = response.data;
            });
        }

        function saveUser(userUpdate) {

            UserService.updateUser(userUpdate, 'profile_pictures,albums.photos,role').then(function(response) {
                self.editing = false;
                toastr.success('Profile updated successfully','Saved!');

                if(typeof response.data.birthdate != 'undefined')
                    response.data.birthdate = new Date(response.data.birthdate *1000);
                else
                    response.data.birthdate = NaN;

                self.user = response.data;
            })
        }
    }

})();