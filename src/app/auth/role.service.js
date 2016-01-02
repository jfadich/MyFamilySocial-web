;(function () {

    function RoleService(api){
        var self = this;

        self.getRoles = function() {
            return api.get(api.url('/roles/'));
        };

    }

    angular.module('MyFamilySocial')
        .service('RoleService', RoleService);

})();
