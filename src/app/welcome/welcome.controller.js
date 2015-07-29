;(function () {

    function ProfileWizardController($scope, user, auth, toastr) {
        var self = this;
        self.currentTab = 'info';
        auth.currentUser().then(function(response) {
            self.user = response.data;
        });

        self.changeTab = function(tab) {
            if(self.currentTab == 'info')
                self.saveUser(self.user);

            self.currentTab = tab;
        };

        self.saveUser = function (userUpdate) {

            user.updateUser(userUpdate, 'role').then(function(response) {
                toastr.success('Profile Updated Successfully', 'Success');

                self.user = response.data.data;
            })
        };

        return self;
    }

    angular.module('inspinia')
        .controller('ProfileWizardCtrl', ProfileWizardController);

})();
