;(function () {

    function PhotoService(api){
        var self = this;
        self.pagination;

        self.getAlbums = function(includes) {
            return api.get(api.url('/albums?with=photos:limit(4)', includes));
        };

        self.getAlbum = function(album) {
            return api.get(api.url('/albums/'+album+'?with=photos.owner,photos.tags,owner'));
        };

        self.getPhoto = function(photo, includes) {
            return api.get(api.url('/photos/'+photo, includes));
        }
    }

    angular.module('inspinia')
        .service('PhotoService', PhotoService);


})();
