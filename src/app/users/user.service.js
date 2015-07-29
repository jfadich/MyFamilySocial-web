;(function(){

    function userService( api ) {
        var self = this;

        self.getUser = function(user, includes) {
            return self.getPromise(user, includes);
        };

        self.getUsers = function(includes) {
            return self.getPromise('',includes);
        };

        self.updateUser = function(user, includes) {
            var userObj = {
                first_name : user.first_name,
                last_name : user.last_name,
                email : user.email,
                phone_one : user.phone_one,
                phone_two : user.phone_two,
                website : user.website,
                city : user.address.city,
                state : user.address.state,
                zip_code : user.address.zip_code,
                street_address : user.address.street_address
            };

            if(user.role != undefined)
                userObj.role = user.role.data.id;

            var birthdate = moment(new Date(user.birthdate)).format('MM/DD/YYYY');
            if(birthdate != 'Invalid date')
                userObj.birthdate = moment(new Date(user.birthdate)).format('MM/DD/YYYY');

            return api.patch(api.url('/users/' + user.id, includes), userObj);
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
        .service('user', ['api', '$rootScope', 'moment', userService]);

})();