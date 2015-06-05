;(function () {

    function PhotoService(api){
        var self = this;
        self.pagination;

        self.getAlbums = function(includes) {
            return api.get(api.url('/albums?with=photos:limit(4)'));
        }
    }

    angular.module('inspinia')
        .service('PhotoService', PhotoService);


})();
