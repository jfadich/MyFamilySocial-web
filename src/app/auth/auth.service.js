;(function () {

    function authService($http, API_URL, $rootScope, token, toastr, $state, $q, ERRORS) {
        var self = this;
        self.defer = false;

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
            if (self.defer)
                return self.defer.promise;
            else {
                self.defer = $q.defer();
            }

            $http.post(API_URL + '/auth/refresh', {}).then(function (response) {
                $rootScope.$broadcast('USER_REFRESH', response.data);
                return self.defer.resolve(response);
            }, function(response) {
                if(response.data === null || response.data.error === undefined) {
                    return self.defer.reject('');
                }

                if(response.data.error.error_code == ERRORS.invalidToken)
                    return self.defer.reject('Invalid session');

                if(response.data.error.error_code == ERRORS.unauthorized) {
                    toastr.error('You\'re not authorized to do that');
                    return self.defer.reject('unauthorized');
                }

                return self.defer.reject(response);
            }).finally(function(){
                self.defer = false;
            });

            return self.defer.promise;
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
                        if(self.defer)
                            return;
                        event.preventDefault();

                        if(!self.canRefresh())
                            return $state.go('login');

                        self.refresh().then(
                            function () {
                                return $state.go(toState.name, toParams);
                            }, function (conso) {console.log(conso);
                                toastr.info('Your session has expired');
                                return $state.go('login');
                        });
                    }
                }
            });

    }

    angular.module('inspinia')
        .service('auth', authService)

})();