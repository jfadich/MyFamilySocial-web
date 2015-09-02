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
            $scope.$broadcast('masonry.reload');
        };

        $scope.$on("$stateChangeSuccess", function() {
            //if($state.params.parentType == 'albums') {
                self.parentLoading      = true;
                AlbumService.getAlbum($state.params.parentKey, 'photos').then(function(response){
                    self.parent = response.data;
                    self.photos = self.parent.photos.data;
                    self.meta = self.parent.photos.meta;
                    self.selected = null;
                }).finally(function() {
                    self.parentLoading = false;
                });
            //}
        });

        return self;

        function watchParent() {
            if($scope.parent.type != undefined && $scope.parentId != $scope.parent.id) {
                $scope.parentLoading = true;
                $scope.parentId = $scope.parent.id;

                $scope.$on('photos.upload.' + $scope.parent.type + '.' + $scope.parent.id, function(event, data){
                    $scope.photos.unshift(data);
                });

                PhotoService.getPhotos($scope.parent, 'tags').then(function(response) {
                    $scope.photos = response.data;
                    $scope.meta = response.meta;
                    $scope.morePhotos = $scope.photos.length > 1;
                }).finally(function() {
                    $scope.parentLoading = false;
                });
            }
        }

        function nextPhoto(event) {
            $scope.editingPhoto = false;
            if(typeof $scope.photos[$scope.currentIndex+1] === 'undefined') {
                event.target.disabled = true;
                if(typeof $scope.meta.pagination.links.next !== 'undefined') {
                    $scope.more().then(function() {
                        if(typeof $scope.photos[$scope.currentIndex+1] !== 'undefined') {
                            event.target.disabled = false;
                            $scope.nextPhoto();
                        }
                    });
                }
            }
            else {
                $scope.currentPhoto = $scope.photos[$scope.currentIndex+1];
                $scope.currentIndex += 1;
            }
        }
        function more() {
            if($scope.parentLoading) return;

            if($scope.meta.pagination != null && $scope.meta.pagination.links != undefined) {
                if($scope.meta.pagination.links.next != null) {
                    $scope.parentLoading = true;
                    return api.get($scope.meta.pagination.links.next).then(function(response) {
                        $scope.photos = $scope.photos.concat(response.data);
                        $scope.meta = response.data.meta;
                    }).finally(function() {
                        $scope.parentLoading = false;
                    });
                }
            }

            return $q.reject('no pages left');
        }
        function prevPhoto() {
            if($scope.currentIndex >= 0) {
                $scope.currentPhoto = $scope.photos[$scope.currentIndex-1];
                $scope.currentIndex -= 1;
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
            $scope.currentPhoto = false;
            $scope.editingPhoto = false;
            $scope.currentIndex = 0;
        }
        function changeDisplay(newDisplay) {
            self.display = newDisplay;
            self.currentPhoto = false;
            self.editingPhoto = false;
        }
    }

})();