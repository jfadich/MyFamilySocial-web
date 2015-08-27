;(function(){

    angular.module('inspinia')
        .factory('UserService', ['api', '$resource', UserService]);

    function UserService( api, $resource ) {

        var userResource = $resource(api.url('/users/:userId'),{userId:'@id'},{update: {method:'PATCH'}});

        return {
            getUser: getUser,
            updateUser: updateUser
        };

        function getUser(user, includes) {
            return api.preFlight().then(function(){

                return userResource.get({userId:user, with:includes}).$promise;

            }).then(api.postFlight, api.catch);
        }
        function updateUser(user, includes) {
            $.extend(user, user.address);

            if(user.role != undefined)
                user.role = user.role.data.id;

            var birthdate = moment(new Date(user.birthdate)).format('MM/DD/YYYY');
            if(birthdate != 'Invalid date')
                user.birthdate = moment(new Date(user.birthdate)).format('MM/DD/YYYY');

            return api.preFlight().then(function(response){

                var u = new userResource(user);
                return u.$update({with:includes});

            }).then(api.postFlight, api.catch);

        }
    }

})();