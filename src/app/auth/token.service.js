;(function () {

    function tokenService($window) {
        var self = this;

        self.save = function (token) {
            if(token === undefined){
                console.log("Can't save an empty token");
                return false;
            }
            $window.localStorage['token'] = token;
        };

        self.get = function () {
            return $window.localStorage['token'];
        };

        self.destroy = function () {
            $window.localStorage.removeItem('token');
        };

        self.claims = function () {
            var token = self.get();
            if(token === undefined || token == null)
                return null;

            var base64Claims = self.validate(token);

            var claims = base64Claims.replace('-', '+').replace('_', '/');

            return JSON.parse($window.atob(claims));
        };

        self.expired = function () {
            var claims = self.claims();
            if(claims === null || Math.round(new Date().getTime() / 1000) > claims.exp)
                return true;

            return false;
        };

        self.live = function() {
            var claims = self.claims();
            var two_weeks = 60 * 60 * 24 * 14;

            if(claims !== null && claims.iat > (Math.round(new Date().getTime() / 1000) - two_weeks) )
                return true;

            return false;
        };

        self.validate = function() {
            var segments = self.get().split(".");
            if (!segments instanceof Array || segments.length !== 3)
                return null;

            return segments[1]; // return encoded claims
        }
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
        .service('token', tokenService)
        .config(function ($httpProvider) {
            $httpProvider.interceptors.push(tokenInterceptor);
        });
})();