;(function () {

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
            if(token === undefined)
                return false;

            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };

        self.logout = function () {
            $window.localStorage.removeItem('token');
        }
    }

    function AuthIntercepter(API, auth, $injector, $q, $location) {
        return {

            request: function (config) {
                if(config.url.indexOf(API) !== 0) {
                    return config; // make sure this is an API request
                }

                var token = auth.getToken();

                if (token) {
                    config.headers.Authorization = 'Bearer ' + token; // automatically attach Authorization header
                }
                else {
                    $location.path('/login');
                }

                if(auth.parseJwt(token).exp < (new Date().getTime() / 1000) && config.url !==  API + '/auth/refresh')
                {
                    var deferred = $q.defer();
                    var http = $injector.get('$http');

                    http.post(API + '/auth/refresh').then(
                        function(response){
                            http(response.config).then(
                                function(response){
                                    deferred.resolve(response);
                                },function (response) {
                                    deferred.reject();
                                })
                        },
                        function(response){
                            deferred.reject();
                            $location.path('/login');
                        })
                }

                return config;
            },

            response: function (res) {

                // If a token was sent back, save it
                if (res.config.url.indexOf(API) === 0 && res.data.token) {
                    auth.saveToken(res.data.token);
                }

                return res;
            }
        }
    }

    angular.module('inspinia')
        .service('auth', authService)
        .constant('API', 'http://myfamily.dev')
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push(['API', 'auth', '$injector', '$q', '$location',AuthIntercepter ]);
        });

})();