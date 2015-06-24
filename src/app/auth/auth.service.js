;(function () {

    function authService($http, API_URL, $rootScope, token, toastr, $state, $q) {
        var self = this;
        self.refreshing = false;

        self.login = function (email, password) {
            return $http.post(API_URL + '/auth/login', {
                email: email,
                password: password
            }).then(function (response) {
                $rootScope.$broadcast('USER_LOGGED_IN', response.data);
            })
        };

        self.register = function (first_name, last_name, email, password, password_confirm) {
            return $http.post(API_URL + '/auth/register', {
                first_name: first_name,
                last_name: last_name,
                email: email,
                password: password,
                password_confirmation: password_confirm
            }).then(function (response) {
                $rootScope.$broadcast('USER_REGISTERED', response.data);
                $rootScope.$broadcast('USER_LOGGED_IN', response.data);
                return response;
            });
        };

        self.logout = function() {
            token.destroy();
            $rootScope.$broadcast('USER_LOGGED_OUT');
        };

        self.refresh = function () {
            if (self.refreshing)
                return self.refreshing;

            var q = $q.defer();
            self.refreshing = q.promise;

            $http.post(API_URL + '/auth/refresh', {}).then(function (response) {
                $rootScope.$broadcast('USER_REFRESH', response.data);
                return q.resolve(response);
            }, function(response) {
                if(response.data === null || response.data.error === undefined) {
                    return q.reject('');
                }

                if(response.data.error.error_code == 103)
                    return q.reject('Invalid session');

                if(response.data.error.error_code == 104) {
                    toastr.error('You\'re not authorized to do that');
                    return q.reject('unauthorized');
                }
            });

            return q.promise;
        };

        self.isAuthenticated = function() {
            return !token.expired();
        };

        self.canRefresh = function() {
            return token.live();
        };

        $rootScope.$on('$stateChangeStart',
            function(event, toState, toParams, fromState, fromParams){
                if(toState.data.requireAuth === true)
                {
                    if(!self.isAuthenticated()) {
                        event.preventDefault();

                        if(!self.canRefresh())
                            return $state.go('login');

                        if(self.refreshing) {
                            return self.refreshing.then(function(){
                                self.request(url, method, data);
                            });
                        }
                        else {
                            return self.refresh().then(
                                function () {
                                    alert('refreshed from state change');
                                    return $state.go(toState.name, toParams);
                                }, function () {
                                    toastr.info('Your session has expired');
                                    return $state.go('login');
                                });
                        }
                    }
                }
            });

    }

    angular.module('inspinia')
        .service('auth', authService)
        .constant('API_URL', 'http://myfamily.dev')

})();