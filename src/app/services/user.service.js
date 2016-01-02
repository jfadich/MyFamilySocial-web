;(function(){

    angular.module('MyFamilySocial')
        .factory('UserService', ['api', UserService]);

    function UserService( api ) {

        return {
            getUser: getUser,
            updateUser: updateUser
        };

        function getUser(user, includes) {
            return api.get(api.url('/users/' + user, includes));
        }
        function updateUser(user, includes) {
            $.extend(user, user.address);

            if(user.role != undefined)
                user.role = user.role.data.id;

            var birthdate = moment(new Date(user.birthdate)).format('MM/DD/YYYY');
            if(birthdate != 'Invalid date')
                user.birthdate = moment(new Date(user.birthdate)).format('MM/DD/YYYY');

            return api.patch(api.url('/users/' + user.id, includes), user);
        }
    }

})();