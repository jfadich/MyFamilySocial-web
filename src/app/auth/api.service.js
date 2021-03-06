;
(function () {

    function apiService($http, API_URL, auth, $state, toastr, $q, ERRORS) {
        var self = this;
        self.refreshing = false;

        self.get = function (endpoint) {
            return self.request(endpoint, 'get');
        };

        self.post = function (endpoint, data) {
            return self.request(endpoint,'post', data);
        };

        self.patch = function (endpoint, data) {
            return self.request(endpoint,'patch', data);
        };

        self.delete = function (endpoint) {
            return self.request(endpoint,'delete');
        };

        self.request = function (url, method, data) {
            var promise;

            if (!auth.canRefresh())
                return $state.go('login');

            if (!auth.isAuthenticated())
                return self.refreshToken(url, method, data);

            if (method === 'get')
                promise = $http.get(url);
            else if (method === 'post')
                promise = $http.post(url, data);
            else if (method === 'patch')
                promise = $http.patch(url, data);
            else if (method === 'delete')
                promise = $http.delete(url);

            return promise.catch(function (response) {console.log(response);
                if(response.data === null ||
                    response.data === undefined||
                    response.data.error === undefined) {
                    return $q.reject(response);
                }

                if (response.data.error.error_code == ERRORS.expiredToken) {
                    if(self.refreshing) {
                        return self.refreshing.then(function(){
                            return self.request(url, method, data);
                        });
                    }
                    else {
                        return self.refreshToken().then(function(){
                            return self.request(url, method, data);
                        });
                    }
                }

                if(response.data.error.error_code === ERRORS.unauthorized) {
                    toastr.error('You do not have sufficient privileges to perform this action', 'Unauthorized');
                }

                if(response.data.error.error_code === ERRORS.invalidEntity) {
                    var errors = response.data.error.message;

                    for(var attributes in errors) {
                        for(var message in errors[attributes])
                            toastr.error(errors[attributes][message]);
                    }
                }

                return $q.reject(response);
            });
        };

        self.refreshToken = function (url, method, data) {
            self.refreshing =  auth.refresh().then(function (response) {
                return self.request(url, method, data);
            }, function (response) {
                toastr.info('Your session has expired');
                return response;
            }).finally(function() {
                self.refreshing = false;
            });

            return self.refreshing;
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