;(function () {

    function PhotoFormController($scope, toastr, $state, TagService, PhotoService) {
        $scope.photo = { tags: { data: [] }};
        $scope.photo.tag_array = [];

        $scope.dirty = {};

        PhotoService.getPhoto($state.params.photo, 'owner,tags,parent').then(function(response){
            $scope.photo = response.data.data;
            $scope.photo.tag_array = $scope.photo.tags.data;
            console.log($scope.photo);
        });

        $scope.tag_autocomplete = {
            suggest: function(search) {
                $scope.tag_results = [];
                var ix = search.lastIndexOf(','),
                    term = search.substring(ix + 1),
                    terms = search.split(',');
                if(terms.length > 0)
                {
                    for(var i = 0; i < terms.length - 1; i++)
                    {
                        if(terms[i] !== '')
                            $scope.photo.tag_array.push({name: terms[i]});
                    }
                    $scope.dirty.value = term;
                }
                if(term == '')
                    return;
                return TagService.search(term).then(function(response){
                    var tags = response.data.data;

                    tags.forEach(function(tag){
                        $scope.tag_results.push({value: tag.name, label: tag.name});
                    });
                    return $scope.tag_results;
                });
            },
            on_select: function(selected) {
                $scope.photo.tag_array.push({name: selected.value});
                $scope.dirty = {};
            }
        };

        $scope.removeTag = function(tag) {
            var index = $scope.photo.tag_array.indexOf(tag);
            $scope.photo.tag_array.splice(index, 1);
        };

        $scope.savePhoto = function(photo) {
            $scope.$broadcast('show-errors-check-validity');
            var message = '';
            var toastTitle;
            if ($scope.editPhoto.$valid) {

                photo.tags = photo.tag_array.map(function(tag){
                    return tag.name;
                }).join(",");

                return PhotoService.updatePhoto(photo).then(function (response) {
                    var photo = response.data.data;
                    toastTitle = photo.name.length > 100 ? (photo.name.substring(0,100) + '...') : photo.name;
                    message = "'" + toastTitle + "' <b>Saved.</b>";
                    return response
                }).then(function(response){
                        toastr.success( message, 'Success',{ iconClass: 'toast-comment', allowHtml: true});
                        console.log( response.data);
                        return $state.go("family.photos.photo", {photo: response.data.data.id});
                    });
            }
        };

        $scope.stopPhotoEdit = function() {
            $state.go("family.photos.photo", {photo: $scope.photo.id});
        }
    }

    angular.module('inspinia')
        .controller('PhotoFormCtrl', PhotoFormController);

})();