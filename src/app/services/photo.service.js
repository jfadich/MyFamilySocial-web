;(function () {

    angular.module('inspinia')
        .factory('PhotoService', PhotoService);

    function PhotoService(api){
        return {
            getAlbums: getAlbums,
            getAlbum: getAlbum,
            addAlbum: addAlbum,
            updateAlbum: updateAlbum,
            getPhoto: getPhoto,
            getPhotos: getPhotos,
            updatePhoto: updatePhoto
        };

        function getAlbums(includes) {
            return api.get(api.url('/albums', includes));
        }
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
        function getPhoto(photo, includes) {
            return api.get(api.url('/photos/'+photo, includes));
        }
        function getPhotos(parent, includes, count) {
            var limit = '';
            if(count != undefined)
                limit = "?limit="+count;
            if(parent == null)
                return api.get(api.url('/photos'+limit, includes));

            return api.get(api.url('/photos/'+parent.type+'/'+parent.id+limit, includes));
        }
        function updatePhoto(photo) {
            return api.patch(api.url('/photos/' + photo.id), {
                name: photo.name,
                description: photo.description,
                tags: photo.tags
            })
        }
    }

})();
