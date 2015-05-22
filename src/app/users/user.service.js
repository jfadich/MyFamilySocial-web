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

        self.getCurrent = function() {
            return self.userPromise('~').
                then(function(response){
                    return response.data.data;
                });
        };

        self.userPromise = function(user) {
            return $http.get(API + '/users/' + user);
        }

    }

    angular.module('inspinia')
        .service('user', userService);

})();