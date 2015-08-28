;(function () {

    function AlbumsExplorerController(PhotoService, $scope, albums,$state, api, token){
        var self = this;
        self.showAlbums = true;
        self.editingAlbum = false;
        self.photoListLoading = true;
        self.photosDisplay = 'grid';
        self.albums = albums;
        self.albums.data = setDownloadLink(albums.data);
        $scope.$on("$stateChangeSuccess", function() {
            self.selectedPhoto = null;
            self.selectedAlbum = null;
            if($state.params.photo != undefined && $state.params.photo != null) {
                PhotoService.getPhoto($state.params.photo, 'parent').then(function(response){
                    self.selectedAlbum = response.data.parent.data;
                    setDownloadLink([self.selectedAlbum]);
                    self.selectedPhoto = response.data.id;
                })
            }
            else if($state.params.album != undefined) {
                PhotoService.getAlbum($state.params.album).then(function(response){
                    self.selectedAlbum = response.data;
                    setDownloadLink([self.selectedAlbum]);
                    self.selectedPhoto = null;
                });
            }
            else {
                self.selectedAlbum = null;
                self.selectedPhoto = null;
                PhotoService.getPhotos(null, 'parent',30).then(function(response){
                    self.photos = response.data;
                    self.meta = response.meta;
                }).finally(function() {
                    self.photoListLoading = false;
                })
            }
        });

        self.toggleAlbumList = function() {
            self.showAlbums = !self.showAlbums;
        };

        self.selectAlbum = function(album) {console.log(album);
            self.selectedAlbum = album;
        };

        self.morePhotoList = function() {
            if(self.photoListLoading) return;

            if(self.meta.pagination != null && self.meta.pagination.links != undefined) {
                if(self.meta.pagination.links.next != null) {
                    self.photoListLoading = true;
                    return api.get(self.meta.pagination.links.next).then(function(response) {
                        self.photos = self.photos.concat(response.data);
                        self.meta = response.meta;
                    }).finally(function() {
                        self.photoListLoading = false;
                    });
                }
            }
        };

        function setDownloadLink(albums) {
            albums.forEach(function(album){
                album.downloadLink = api.url('/albums/'+ album.slug + '/download?token='+token.get());
            });
            return albums;
        }

        return self;
    }
    angular.module('inspinia')
        .controller('AlbumsExplorerCtrl', AlbumsExplorerController);

})();


