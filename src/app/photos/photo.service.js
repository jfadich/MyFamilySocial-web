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

        self.addAlbum = function(album) {
            return api.post(api.url('/albums'), album);
        };

        self.updateAlbum = function(album) {
            return api.patch(api.url('/albums/' + album.slug), {
                name: album.name,
                shared: album.shared,
                description: album.description
            })
        };

        self.getPhoto = function(photo, includes) {
            return api.get(api.url('/photos/'+photo, includes));
        };

    }

    angular.module('inspinia')
        .service('PhotoService', PhotoService);


})();
