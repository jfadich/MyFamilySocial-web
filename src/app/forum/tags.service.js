;(function () {

    function TagService(api){
        var self = this;

        self.search = function(term) {
            return api.get(api.url('/tags/search?term=' + term));
        }
    }

    angular.module('inspinia')
        .service('TagService', TagService);


})();
