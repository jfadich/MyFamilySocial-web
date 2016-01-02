;(function () {

    angular.module('MyFamilySocial')
        .controller('ProfileCtrl', ProfileController);

    function ProfileController($scope, UserService, $state, RoleService, toastr, api) {
        var self = this;
        self.user = [];
        self.roles = [];
        self.editing = false;
        self.activityLoading = true;
        self.more = more;
        self.saveUser = saveUser;

        activate();

        return self;

        function activate() {
            UserService.getUser($state.params.user, 'profile_pictures,activity.photos,role').then(function(users){
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

        function more() {
            if(self.activityLoading) return;

            if(self.user.activity.meta.pagination != null && self.user.activity.meta.pagination.links != undefined) {
                if(self.user.activity.meta.pagination.links.next != null) {
                    self.activityLoading = true;
                    api.get(self.user.activity.meta.pagination.links.next).then(function(response) {
                        self.user.activity.data = self.feed.concat(response.data.activity.data);
                        self.user.activity.meta = response.data.activity.meta;
                    }).finally(function() {
                        self.activityLoading = false;
                    });
                }
            }

        }
    }

})();