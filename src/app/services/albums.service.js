;(function () {

    angular.module('inspinia')
        .service('AlbumService', AlbumService);

    function AlbumService(api){
        return {
            getAlbum: getAlbum,
            addAlbum: addAlbum,
            updateAlbum: updateAlbum
        };

        function getAlbum(album, includes) {
            return api.get(api.url('/albums/'+album, includes));
        }

        function addAlbum(album) {
            return api.post(api.url('/albums'), album);
        }

        function updateAlbum(album) {
            return api.patch(api.url('/albums/' + album.slug), {
                name: album.name,
                shared: album.shared,
                description: album.description
            })
        }
    }

})();
