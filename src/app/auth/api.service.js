;
(function () {

    function apiService($http, API_URL, auth, $state, toastr, token) {
        var self = this;

        self.get = function (endpoint) {
            return self.request(endpoint, 'get');
        };

        self.post = function (endpoint, data) {
            return self.request(endpoint,'post', data);
        };

        self.request = function (url, method, data) {
            var promise;

            if (!token.live())
                return $state.go('login');

            if (token.expired())
                return self.refreshToken(url, method, data);

            if (method === 'get')
                promise = $http.get(url);
            else if (method === 'post')
                promise = $http.post(url, data);

            return promise.then(function (response) {
                return response; // everything's good, pass it on to service
            }, function (response) {console.log(response);
                if (response.data.error.error_code == 102) {
                    return self.refreshToken(url, method, data);
                }
                return response;
            });
        };

        self.refreshToken = function (url, method, data) {
            return auth.refresh().then(function (response) {
                alert('Your session has refreshed!');
                return self.request(url, method, data);
            }, function (response) {
                toastr.info('Your session has expired');
                return $state.go('login');
            });
        };

        self.url = function (endpoint, includes) {
            if (endpoint.indexOf(API_URL) === 0)
                var url = endpoint;
            else
                var url = API_URL + endpoint;

            if(includes !== undefined) {
                url += url.indexOf('?') !== -1 ? '&' : '?';
                url += 'with=' + includes;
            }

            return url;
        }

    }

    angular.module('inspinia')
        .service('api', apiService)


})();