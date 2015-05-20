;
(function () {
    function authInterceptor(API, auth) {
        return {

            request: function (config) {
                var token = auth.getToken();
                if (config.url.indexOf(API) === 0 && token) {
                    // automatically attach Authorization header
                    config.headers.Authorization = 'Bearer ' + token;
                }

                return config;
            },

            response: function (res) {

                // If a token was sent back, save it
                if (res.config.url.indexOf(API) === 0 && res.data.token) {
                    auth.saveToken(res.data.token);
                }

                // If a token is invalid, attempt to refresh it
                if (res.status === 401 && res.data.error && res.data.error === "invalid_token") {

                    // TODO auto refresh
                }

                return res;
            },
        }
    }

    function authService($window) {
        var self = this;

        self.saveToken = function (token) {
            $window.localStorage['token'] = token;
        };

        self.getToken = function () {
            return $window.localStorage['token'];
        };

        self.isAuthed = function () {
            var token = self.getToken();
            if (token) {
                var params = self.parseJwt(token);
                return Math.round(new Date().getTime() / 1000) <= params.exp;
            } else {
                return false;
            }
        };

        self.parseJwt = function (token) {
            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };

        self.logout = function () {
            $window.localStorage.removeItem('token');
        }
    }

    angular.module('inspinia')
        .factory('authInterceptor', authInterceptor)
        .service('auth', authService)
        .constant('API', 'http://myfamily.dev')
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push('authInterceptor');
        });
})();