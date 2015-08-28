;(function () {

    function UsersController($scope, UserService, api, $anchorScroll) {
        $scope.categories = [];
        $scope.showUser = 0;
        $scope.usersLoading = true;
        $scope.searchUser = '';
        UserService.getUser('').then(function(users){
            $scope.users = users.data;
            $scope.meta = users.meta;
        }).finally(function(){
            $scope.usersLoading = false;
        });

        $scope.selectUser = function(user) {
            $scope.showUser = user.id;
            $anchorScroll();
        };

        $scope.more = function() {
            if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
                if($scope.meta.pagination.links.next != null)
                    $scope.usersLoading = true;
                    api.get($scope.meta.pagination.links.next).then(function(response) {
                        $scope.users = $scope.users.concat(response.data);
                        $scope.meta = response.meta;
                    }).finally(function(){
                        $scope.usersLoading = false;
                    });
            }
        };

    }


    angular.module('inspinia')
        .controller('UsersCtrl', UsersController);

})();


