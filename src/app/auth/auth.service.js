;(function () {

    function authService($http, API_URL, $rootScope, token, toastr, $state) {
        var self = this;

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
            return $http.post(API_URL + '/auth/refresh', {}).then(function (response) {
                $rootScope.$broadcast('USER_REFRESH', response.data);
                return response;
            });
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
                    if(!self.isAuthenticated()){
                        event.preventDefault();

                        if(!self.canRefresh())
                            return $state.go('login');

                        return self.refresh().then(
                            function(response){alert('refreshed');
                                return $state.go(toState.name,toParams);
                            }, function(response) {
                                toastr.info('Your session has expired');
                                return $state.go('login');
                            });
                    }
                }
            });

    }

    angular.module('inspinia')
        .service('auth', authService)
        .constant('API_URL', 'http://myfamily.dev')

})();