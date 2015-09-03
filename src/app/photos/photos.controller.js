;(function () {

    angular.module('inspinia')
        .controller('PhotoMasterCtrl', PhotoMasterController);

    function PhotoMasterController($scope, PhotoService, $q, api, $state, AlbumService,albums) {
        var self = this;
        self.parent             = {permissions: {add_photo: false}}; // disable dropzone until parent enables it
        self.closeExplorer      = closeExplorer;
        self.changeDisplay      = changeDisplay;
        self.selectPhoto        = selectPhoto;
        self.nextPhoto          = nextPhoto;
        self.prevPhoto          = prevPhoto;
        self.showAlbumList      = true;
        self.display            = 'gallery';
        self.more               = more;
        self.photos             = [];
        self.editingPhoto       = false;
        self.parentLoading      = true;
        self.currentIndex       = 0;
        self.selected           = null;
        self.parentId           = 0;
        self.albums             = albums.data;

        self.toggleAlbumList = function() {
            self.showAlbumList = !self.showAlbumList;
            if(self.display == 'gallery')
                $scope.$broadcast('masonry.reload');
        };

        $scope.$on("$stateChangeSuccess", function() {
            //if($state.params.parentType == 'albums') {
                self.parentLoading      = true;
                AlbumService.getAlbum($state.params.parentKey, 'photos').then(function(response){
                    self.parent = response.data;
                    self.photos = self.parent.photos.data;
                    self.meta = self.parent.photos.meta;console.log(self.meta);
                    self.selected = null;
                    $scope.$on('photos.upload.' + self.parent.type + '.' + self.parent.id, function(event, data){
                        self.photos = self.photos.concat(data);
                    });
                }).finally(function() {
                    self.parentLoading = false;
                });
            //}
        });

        return self;

        function nextPhoto(event) {
            self.editingPhoto = false;
            if(typeof self.photos[self.currentIndex+1] === 'undefined') {
                event.target.disabled = true;
                if(typeof self.meta.pagination.links.next !== 'undefined') {
                    self.more().then(function() {
                        if(typeof self.photos[self.currentIndex+1] !== 'undefined') {
                            event.target.disabled = false;
                            self.nextPhoto();
                        }
                    });
                }
            }
            else {
                self.selected = self.photos[self.currentIndex+1];
                self.currentIndex += 1;
            }
        }
        function more() {
            if(self.parentLoading) return;

            if(self.meta.pagination != null && self.meta.pagination.links != undefined) {
                if(self.meta.pagination.links.next != null) {
                    self.parentLoading = true;
                    return api.get(self.meta.pagination.links.next).then(function(response) {
                        self.photos = self.photos.concat(response.data.photos.data);
                        self.meta = response.data.photos.meta;console.log(response)
                    }).finally(function() {
                        self.parentLoading = false;
                    });
                }
            }

            return $q.reject('no pages left');
        }
        function prevPhoto() {
            if(self.currentIndex >= 0) {
                self.selected = self.photos[self.currentIndex-1];
                self.currentIndex -= 1;
            }
        }
        function selectPhoto(photo) {
            self.editingPhoto = false;
            if(typeof self.photos[photo] == 'object') {
                self.currentIndex = photo;
                self.selected = self.photos[photo];

            }
        }
        function closeExplorer() {
            self.selected = false;
            self.editingPhoto = false;
            self.currentIndex = 0;
        }
        function changeDisplay(newDisplay) {
            self.display = newDisplay;
            self.selected = false;
            self.editingPhoto = false;
        }
    }

})();