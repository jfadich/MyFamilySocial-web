;(function () {

    function ProfileController($scope, user, $state) {
        $scope.user = [];

        $scope.headerTitle = 'Family Members';
        $scope.breadcrumbs = [{title: 'Family Members', link: '#/members'}];
        user.getUser($state.params.user).then(function(users){
            $scope.user = users.data;
        });

    }

    angular.module('inspinia')
        .controller('ProfileCtrl', ProfileController);

})();


