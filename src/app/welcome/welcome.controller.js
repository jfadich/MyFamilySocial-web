;(function () {

    function ProfileWizardController(user, auth, toastr) {
        var self = this;
        self.currentTab = 'info';
        auth.currentUser().then(function(response) {
            self.user = response.data;
        });

        self.changeTab = function(tab) {
            if(self.currentTab == 'info' && self.wizardForm.$dirty)
                self.saveUser(self.user).then(function() {  console.log(self.wizardForm.$dirty);
                    self.wizardForm.$dirty = false;
                });

            self.currentTab = tab;
        };

        self.saveUser = function (userUpdate) {
            return user.updateUser(userUpdate, 'role').then(function(response) {
                toastr.success('Profile Updated Successfully', 'Success');

                self.user = response.data.data;
            })
        };

        return self;
    }

    angular.module('inspinia')
        .controller('ProfileWizardCtrl', ProfileWizardController);

})();
