;(function () {

    function UsersController($scope, user, $state) {
        $scope.categories = [];

        $scope.headerTitle = 'Family Members';
        $scope.breadcrumbs = [{title: 'Family Members', link: '#/members'}];
        user.getUsers().then(function(users){
            $scope.users = users;
        });

    }


    angular.module('inspinia')
        .controller('UsersCtrl', UsersController);

})();


