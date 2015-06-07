;(function () {

    function PhotoService(api){
        var self = this;
        self.pagination;

        self.getAlbums = function(includes) {
            return api.get(api.url('/albums?with=photos:limit(4)'));
        };

        self.getAlbum = function(album) {
            return api.get(api.url('/albums/'+album+'?with=photos.owner,photos.tags,owner'));
        }
    }

    angular.module('inspinia')
        .service('PhotoService', PhotoService);


})();
