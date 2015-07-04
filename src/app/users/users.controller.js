;(function () {

    function UsersController($scope, user, api) {
        $scope.categories = [];

        $scope.headerTitle = 'Family Members';
        $scope.breadcrumbs = [{title: 'Family Members', link: '#/members'}];
        user.getUsers().then(function(users){
            $scope.users = users.data;
            $scope.meta = users.meta;
        });

        $scope.more = function() {
            if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
                if($scope.meta.pagination.links.next != null)
                    api.get($scope.meta.pagination.links.next).then(function(response) {
                        $scope.users = $scope.users.concat(response.data.data);
                        $scope.meta = response.data.meta;
                    })
            }
        };

    }


    angular.module('inspinia')
        .controller('UsersCtrl', UsersController);

})();


