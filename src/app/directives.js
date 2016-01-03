'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('MyFamilySocial')

    .directive('pageTitle', function ($rootScope, $timeout) {
            return {
                link: function(scope, element) {
                    var listener = function(event, toState, toParams, fromState, fromParams) {
                        // Default title - load on Dashboard 1
                        var title = 'Fadich.com';
                        // Create your own title pattern
                        if (toState.data && toState.data.pageTitle) title = toState.data.pageTitle + ' | Fadich.com';
                        $timeout(function() {
                            element.text(title);
                        });
                    };
                    $rootScope.$on('$stateChangeStart', listener);
                }
            }
        })


        .directive("dropzone", function(api, token, toastr, $rootScope, ERRORS) {
            return {
                scope: {
                    dzParent: '='
                },
                link: function (scope, element, attrs) {

                    scope.$watch("dzParent", function() {
                        if (attrs.dzPermissions === undefined || attrs.dzPermissions == "false" || scope.dzParent === undefined)
                            return;

                        if(scope.dzParent.type != undefined && scope.parentId != scope.dzParent.id) {
                            scope.parentId = scope.dzParent.id;
                            var dzOptions = {
                                url: api.url('/photos'),
                                maxFilesize: 20,
                                paramName: "photo",
                                acceptedFiles: 'image/*',
                                previewsContainer: '#preview',
                                clickable: '#dz-clickable',
                                sending: function (file, xhr, formData) {
                                    xhr.setRequestHeader('Authorization', 'Bearer: ' + token.get());
                                    formData.append('parent_id', scope.dzParent.id);
                                    formData.append('parent_type', scope.dzParent.type);
                                },
                                init: function () {
                                    this.on('success', function (file, json) {
                                        this.removeFile(file);
                                        toastr.success('Photo uploaded', 'Success');
                                        $rootScope.$broadcast('photos.upload.'+ scope.dzParent.type + '.' + scope.dzParent.id, json.data)
                                    });
                                    this.on('addedfile', function (file) {
                                        $('.dropzone').removeClass('hide');
                                    });
                                    this.on('removedfile', function (file) {
                                        if (this.files.length == 0)
                                            $('.dropzone').addClass('hide');
                                    });
                                    this.on('error', function (file, response) {
                                        if (response.error.error_code == ERRORS.invalidEntity) {
                                            $(file.previewElement).find('.dz-error-message').text(response.error.message);
                                            toastr.error(response.error.message);
                                        }
                                    });
                                }
                            };

                            if (attrs.dzOptions !== undefined) {
                                $.extend(dzOptions, JSON.parse(attrs.dzOptions));
                            }

                            element.dropzone(dzOptions);
                        }
                    });

                }
            }
        });
