;(function () {

    function authService($http, API_URL, $rootScope, token) {
        var self = this;

        self.login = function (email, password) {
            return $http.post(API_URL + '/auth/login', {
                email: email,
                password: password
            }).then(function (response) {
                $rootScope.$broadcast('USER_LOGGED_IN', response.data);
            })
        };

        self.logout = function() {
            token.destroy();
            $rootScope.$broadcast('USER_LOGGED_OUT');
        };

        self.refresh = function () {
            return $http.post(API_URL + '/auth/refresh', {})
        };

        self.isAuthenticated = function() {
            return !token.expired();
        };

        self.canRefresh = function() {
            return token.live();
        };

        self.getCurrent = function () {
            return $http.get(API_URL + '/users/~?with=role').
                then(function (response) {
                    return response.data.data;
                }, function (response) {
                    return console.log(response);
                });
        };

    }

    function tokenInterceptor(API_URL, token) {
        return {

            request: function (request) {
                if(request.url.indexOf(API_URL) !== 0 || request.url.indexOf(API_URL + '/auth/login') === 0) {
                    return request; // make sure this is an API request
                }

                if (token.live())
                    request.headers.Authorization = 'Bearer ' + token.get(); // automatically attach Authorization header

                return request;
            },

            response: function (response) {
                // If a token was sent back, save it
                if (response.config.url.indexOf(API_URL) === 0 && response.data.token) {
                    token.save(response.data.token);
                }

                return response;
            }
        }
    }
    angular.module('inspinia')
        .service('auth', authService)
        .constant('API_URL', 'http://myfamily.dev')
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push(tokenInterceptor);
        });


})();