;(function(){

    function userService($http, API) {
        var self = this;

        self.login = function(email, password) {
            return $http.post(API + '/auth/login', {
                email: email,
                password: password
            })
        };

        self.refresh = function() {
            return $http.post(API + '/auth/refresh', {})
        };

    }

    angular.module('inspinia')
        .service('user', userService);

})();