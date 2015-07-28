;(function () {

    function UsersController($scope, user, api) {
        $scope.categories = [];
        $scope.showUser = 0;
        $scope.usersLoading = true;
        $scope.searchUser = '';
        user.getUsers().then(function(users){
            $scope.users = users.data;
            $scope.meta = users.meta;
        }).finally(function(){
            $scope.usersLoading = false;
        });

        $scope.selectUser = function(user) {
            $scope.showUser = user.id;
        };

        $scope.more = function() {
            if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
                if($scope.meta.pagination.links.next != null)
                    $scope.usersLoading = true;
                    api.get($scope.meta.pagination.links.next).then(function(response) {
                        $scope.users = $scope.users.concat(response.data.data);
                        $scope.meta = response.data.meta;
                    }).finally(function(){
                        $scope.usersLoading = false;
                    });
            }
        };

    }


    angular.module('inspinia')
        .controller('UsersCtrl', UsersController);

})();


