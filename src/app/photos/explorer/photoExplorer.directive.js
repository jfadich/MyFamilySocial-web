
function PhotoExplorerController($scope, PhotoService, $q, api, $timeout) {

    $scope.editingPhoto = false;
    $scope.currentPhoto = false;
    $scope.display = 'gallery';
    $scope.currentIndex = 0;
    $scope.parentId = 0;

    $scope.$watch("parent", function() {
        if($scope.parent.type != undefined && $scope.parentId != $scope.parent.id) {
            $scope.parentId = $scope.parent.id;
            PhotoService.getPhotos($scope.parent, 'tags').then(function(response) {
                $scope.photos = response.data.data;
                $scope.meta = response.data.meta;
                $scope.morePhotos = $scope.photos.length > 1;

                // If the photo that the user is looking for is not in the original request, get it
                if($scope.highlightImage != 0) {
                    var highlight  = $.grep($scope.photos, function(e){ return e.id == $scope.highlightImage; });
                    if(highlight.length == 0) {
                        PhotoService.getPhoto($scope.highlightImage,'parent').then(function (response) {
                            if(response.data.data.parent.data == $scope.parent.id)
                                $scope.photos.unshift(response.data.data);
                        });
                    }
                }
            })
        }
    });

    $scope.nextPhoto = function(event) {
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
    };

    $scope.more = function() {
        if(typeof $scope.meta.pagination.links.next !== 'undefined') {
            return api.get($scope.meta.pagination.links.next).then(function(response) {
                $scope.photos = $scope.photos.concat(response.data.data);
                $scope.meta = response.data.meta;
            });
        }
        else
            return $q.reject('no more pages');
    };

    $scope.prevPhoto = function() {
        if($scope.currentIndex >= 0) {
            $scope.currentPhoto = $scope.photos[$scope.currentIndex-1];
            $scope.currentIndex -= 1;
        }
    };

    $scope.selectPhoto = function(photo) {
        $scope.editingPhoto = false;
        if(typeof $scope.photos[photo] == 'object') {
            $scope.currentIndex = photo;
            $scope.currentPhoto = $scope.photos[photo];

        }
    };

    $scope.closeExplorer = function() {
        $scope.currentPhoto = false;
        $scope.editingPhoto = false;
        $scope.currentIndex = 0;
    };

    $scope.gallery = function(event) {
        event = event || window.event;
        var target = event.target || event.srcElement,
            link = target.src ? target.parentNode : target,
            options = {index: link, event: event},
            links = event.currentTarget.getElementsByTagName('a');

        if(angular.element(target).hasClass('btn') || angular.element(target).hasClass('fa'))
            return;

        blueimp.Gallery(links, options);
    };

    $scope.changeDisplay = function(newDisplay) {
        $scope.display = newDisplay;
        $scope.currentPhoto = false;
        $scope.editingPhoto = false;
    };

    $scope.editPhoto = function() {
        $scope.editingPhoto = !$scope.editingPhoto;
    };

    //give the image a change to load
    $timeout(function() {
        $scope.targetImage = $scope.highlightImage;
    },1000);
    //remove the highlight to prevent subviews from redrawing animation
    $timeout(function() {
        $scope.targetImage = 0;
    },2500);
}

angular.module('inspinia')
    .directive("photoExplorer", function() {
        return {
            restrict: 'E',
            templateUrl: "app/photos/explorer/container.html",
            scope: {
                parent: '=parent',
                highlightImage: '=highlightImage'
            },
            controller: PhotoExplorerController
        }});