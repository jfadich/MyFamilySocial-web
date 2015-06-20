;(function () {

    function PhotoService(api){
        var self = this;
        self.pagination;

        self.getAlbums = function(includes) {
            return api.get(api.url('/albums', includes));
        };

        self.getAlbum = function(album, includes) {
            return api.get(api.url('/albums/'+album, includes));
        };

        self.getPhoto = function(photo, includes) {
            return api.get(api.url('/photos/'+photo, includes));
        }
    }

    angular.module('inspinia')
        .service('PhotoService', PhotoService);


})();
