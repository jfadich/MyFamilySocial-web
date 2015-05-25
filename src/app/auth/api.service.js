;(function () {

    function apiService($http, API_URL, auth, $state, toastr, token) {
        var self = this;

        self.get = function (endpoint) {
            if (!token.live())
                return $state.go('login');

            if(endpoint.indexOf(API_URL) === 0)
                var url = endpoint;
            else
                var url = API_URL + endpoint;

            if(token.expired())
                return self.refreshToken(url, 'get');

            return $http.get(url).then(function (response) {
                    return response; // everything's good, pass it on to service
                }, function(response) {
                    if (response.data.error.error_code == 102) {
                        return self.refreshToken(url, 'get');
                    }
                    return response;
                });
        };

        self.post = function (endpoint, data) {
            if (token.claims() == null)
                return $state.go('login');

            return $http.post(API_URL + endpoint, data).error(function (response) {
                if (response.data.error_code == 102) {alert('api');
                    auth.refresh().then(function(response){
                        alert('Your session has refreshed!');
                        return $http.post(API_URL + endpoint, data);
                    }, function(response){
                        toastr.info('Your session has expired');
                        $state.go('login');
                    });
                }
                return response;
            });
        };

        self.validateToken = function() {

        };

        self.refreshToken = function(url, method, data)
        {
            return auth.refresh().then(function(response) {
                alert('Your session has refreshed!');
                if(method === 'get')
                    return $http.get(url);
                if(method === 'post')
                    return $http.post(url, data);
            }, function(response){
                toastr.info('Your session has expired');
                return $state.go('login');
            });
        };

    }

    angular.module('inspinia')
        .service('api', apiService)


})();