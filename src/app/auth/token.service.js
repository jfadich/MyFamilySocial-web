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

            var segments = token.split(".");
            if (!segments instanceof Array || segments.length !== 3)
                return null;

            var base64Claims = segments[1];

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
        }
    }

    angular.module('inspinia')
        .service('token', tokenService)
})();