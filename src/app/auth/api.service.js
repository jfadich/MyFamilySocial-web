;
(function () {

    function apiService($http, API_URL, auth, $state, toastr, token, $q) {
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

            if (!token.live())
                return $state.go('login');

            if (token.expired())
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
                if(response.data === null || response.data.error === undefined) {
                    return $q.reject(response);
                }

                if (response.data.error.error_code == 102) {
                    if(self.refreshing) {
                        return self.refreshing.then(function(){
                            self.request(url, method, data);
                        });
                    }
                    else {
                        var q = $q.defer();

                        self.refreshToken(url, method, data).then(function(response){
                            q.resolve(response);
                        }, function(response){
                            q.reject(response);
                        });

                        return q.promise;
                    }
                }

                if(response.data.error.error_code === 201) {
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
                alert('refreshed from API!');
                return self.request(url, method, data);
            }, function (response) {
                toastr.info('Your session has expired');
                return response;
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