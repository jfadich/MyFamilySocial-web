;(function () {

    function ProfileWizardController($scope, $state, auth, toastr) {
        var self = this;
        self.currentTab = 'info';


        return self;
    }

    angular.module('inspinia')
        .controller('ProfileWizardCtrl', ProfileWizardController);

})();
