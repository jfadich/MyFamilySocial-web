
function PhotoExplorerController($scope, PhotoService, toastr, api) {

    $scope.currentPhoto = false;
    $scope.display = 'gallery';
    $scope.morePhotos = false;
    $scope.currentIndex = 0;
    $scope.parentId = 0;

    $scope.$watch("parent", function() {
        if($scope.parent.type != undefined && $scope.parentId != $scope.parent.id) {
            $scope.parentId = $scope.parent.id;
            PhotoService.getPhotos($scope.parent, 'tags').then(function(response) {
                $scope.photos = response.data.data;
                $scope.meta = response.data.meta;
                $scope.morePhotos = $scope.photos.length > 0;
            })
        }
    });

    $scope.nextPhoto = function() {
        if(typeof $scope.photos[$scope.currentIndex+1] === 'undefined') {
            $scope.morePhotos = false;
            if(typeof $scope.meta.pagination.links.next !== 'undefined') {
                $scope.more().then(function() {
                    if(typeof $scope.photos[$scope.currentIndex+1] !== 'undefined') {
                        $scope.morePhotos = true;
                        $scope.nextPhoto();
                    }
                });
            }
        }
        else {
            $scope.currentPhoto = $scope.photos[$scope.currentIndex+1];
            $scope.currentIndex += 1;
            if(typeof $scope.photos[$scope.currentIndex+1] === 'undefined') {
                $scope.morePhotos = false;
            }
        }
    };

    $scope.more = function() {
        if(typeof $scope.meta.pagination.links.next !== 'undefined') {
            api.get($scope.meta.pagination.links.next).then(function(response) {
                $scope.photos = $scope.photos.concat(response.data.data);
                $scope.meta = response.data.meta;
            });
        }
    };

    $scope.prevPhoto = function() {
        if($scope.currentIndex >= 0) {
            $scope.currentPhoto = $scope.photos[$scope.currentIndex-1];
            $scope.currentIndex -= 1;
            $scope.morePhotos = true;
        }
    };

    $scope.selectPhoto = function(photo) {
        if(typeof $scope.photos[photo] == 'object') {
            $scope.currentIndex = photo;
            $scope.currentPhoto = $scope.photos[photo];

        }
    };

    $scope.closeExplorer = function() {
        $scope.currentPhoto = false;
        $scope.currentIndex = 0;
    };

    $scope.gallery = function(event) {
        event = event || window.event;
        var target = event.target || event.srcElement,
            link = target.src ? target.parentNode : target,
            options = {index: link, event: event},
            links = event.currentTarget.getElementsByTagName('a');

        blueimp.Gallery(links, options);
    };

    $scope.changeDisplay = function(newDisplay) {
        $scope.display = newDisplay;
    };
}

angular.module('inspinia')
    .directive("photoExplorer", function() {
        return {
            restrict: 'E',
            templateUrl: "app/photos/explorer/container.html",
            scope: {
                parent: '=parent'
            },
            controller: PhotoExplorerController
        }});