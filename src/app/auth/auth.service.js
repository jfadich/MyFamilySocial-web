;(function () {

    function authService($window) {
        var self = this;

        self.saveToken = function (token) {
            $window.localStorage['token'] = token;
        };

        self.getToken = function () {
            return $window.localStorage['token'];
        };

        self.isAuthenticated = function () {
            var token = self.getToken();
            if (token === null)
                return false;

            var params = self.parseJwt(token);

            if (params === null)
                return false;

            if(Math.round(new Date().getTime() / 1000) <= params.exp)
                return true;

            return false;
        };

        self.parseJwt = function (token) {
            if(token === undefined)
                return null;

            var base64Url = token.split('.')[1];
            var base64 = base64Url.replace('-', '+').replace('_', '/');
            return JSON.parse($window.atob(base64));
        };

        self.logout = function () {
            $window.localStorage.removeItem('token');
        };

        self.validateToken = function() {
            var token = self.getToken();
            if (token === null)
                return null;

            var params = self.parseJwt(token);

            if (params === null)
                return null;

            return params;
        }
    }

    function AuthInterceptor(API, auth, $injector, $q) {
        return {

            request: function (config) {
                if(config.url.indexOf(API) !== 0 || config.url.indexOf(API + '/auth/login') === 0) {
                    return config; // make sure this is an API request
                }
                var $state =  $injector.get('$state');

                var token = auth.getToken();
                var params = auth.parseJwt(token);

                if(params === null)
                    return $state.go('login');

                var expired = params.exp < (new Date().getTime() / 1000);

                if (!expired || config.url == API + '/auth/refresh') {
                    config.headers.Authorization = 'Bearer ' + token; // automatically attach Authorization header
                    return config;
                }
                else
                {
                    var deferred = $q.defer();
                    var http = $injector.get('$http');
                    console.log('attempted refresh');
                    http.post(API + '/auth/refresh').then(
                        function(response){
                            token = response.data.token;
                            if(token === null)
                                return $state.go('login');

                            auth.saveToken(token);console.log('new token:' + token);

                            http(config.config).then(
                                function(response){
                                    deferred.resolve(response);
                                },function (response) {
                                    deferred.reject();
                                })
                        },
                        function(response){
                            deferred.reject();
                            $state.go('login');
                        })
                }
            },

            response: function (res) {

                if(res.status == 401)
                    $state.go('login');

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
            $httpProvider.interceptors.push(['API', 'auth', '$injector', '$q', '$location',AuthInterceptor ]);
        });

})();