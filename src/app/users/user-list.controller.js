;(function () {

    function UsersController($scope, UserService, api, $anchorScroll) {
        var self = this;
        self.showUser = 0;
        self.usersLoading = true;
        self.searchUser = '';
        self.selectUser = selectUser;
        self.more = more;

        activate();

        return self;

        function activate() {
            UserService.getUser('?take=2').then(function(users){
                self.users = users.data;
                self.meta = users.meta;
            }).finally(function(){
                self.usersLoading = false;
            });
        }

        function selectUser(user) {
            self.showUser = user.id;
            $anchorScroll('user-box');
        }
        function more() {
            if(self.meta.pagination != null && self.meta.pagination.links != undefined) {
                if(self.meta.pagination.links.next != null)
                    self.usersLoading = true;
                    api.get(self.meta.pagination.links.next).then(function(response) {
                        self.users = self.users.concat(response.data);
                        self.meta = response.meta;
                    }).finally(function(){
                        self.usersLoading = false;
                    });
            }
        }
    }


    angular.module('MyFamilySocial')
        .controller('UsersCtrl', UsersController);

})();


