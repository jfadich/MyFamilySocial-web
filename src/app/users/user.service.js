;(function(){

    function userService($http, API, $rootScope) {
        var self = this;
        self.includes = '';

        self.login = function(email, password) {
            return $http.post(API + '/auth/login', {
                email: email,
                password: password
            }).then(function(response){
                $rootScope.$broadcast('USER_LOGGED_IN', response.data);
            })
        };

        self.refresh = function() {
            return $http.post(API + '/auth/refresh', {})
        };

        self.getCurrent = function() {
            return self.userPromise('~');
        };

        self.getUsers = function() {
            return self.userPromise();
        };

        self.with = function(includes) {
            self.includes = includes;

            return self;
        };

        self.url = function(endpoint) {
            var path = API + '/users/' + endpoint;

            if(self.includes != '') {
                path = path + '?with=' + self.includes;
            }

            return path;
        };

        self.userPromise = function(user) {
            if(user === undefined)
                user = '';

            return $http.get(self.url(user)).
                then(function(response){
                    return response.data.data;
                }, function(response){
                    console.log(response);
                });
        }

    }

    angular.module('inspinia')
        .service('user', ['$http','API', '$rootScope', userService]);

})();