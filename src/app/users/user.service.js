;(function(){

    function userService( api ) {
        var self = this;

        self.getUser = function(user, includes) {
            return self.getPromise(user, includes);
        };

        self.getUsers = function(includes) {
            return self.getPromise('',includes);
        };

        self.getPromise = function(endpoint, includes) {
            return api.get(self.url(endpoint, includes)).
                then(function(response){
                    self.pagination = get_recursive(response.data, 'pagination');
                    return response.data;
                });
        };

        self.postPromise = function(endpoint, data) {
            if(endpoint === undefined)
                endpoint = '';

            return api.post(self.url(endpoint), data)
        };

        self.next = function() {
            if(self.pagination === null || self.pagination.links.next === undefined)
                return null;

            return self.getPromise(self.pagination.links.next);
        };

        self.url = function(endpoint, includes) {
            if(endpoint === undefined)
                endpoint = '/users/';

            if(includes === undefined)
                includes = '';

            if((endpoint.indexOf("http") !== 0))
                endpoint = '/users/' + endpoint;

            return api.url(endpoint, includes);
        }

    }

    angular.module('inspinia')
        .service('user', ['api', '$rootScope', userService]);

})();