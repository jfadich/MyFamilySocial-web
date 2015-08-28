;(function () {

    angular.module('inspinia')
        .factory('PhotoService', PhotoService);

    function PhotoService(api){
        return {
            getPhoto: getPhoto,
            getPhotos: getPhotos,
            updatePhoto: updatePhoto
        };

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
