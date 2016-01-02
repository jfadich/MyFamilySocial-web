;(function () {

    angular.module('MyFamilySocial')
        .factory('TagService', TagService);

    function TagService(api){
        return {
            search: search
        };

        function search(term) {
            return api.get(api.url('/tags/search?term=' + term));
        }
    }

})();
