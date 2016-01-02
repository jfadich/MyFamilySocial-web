(function() {

    angular.module('MyFamilySocial')
        .directive("profilePicture", profilePicture);

    function profilePicture() {
        return {
            restrict: 'E',
            scope: { user: '=' },
            transclue: true,
            template: function(element, attr) {
                var img = '<img ng-src="{{imgSource}}" alt="{{ user.display_name }}" class="{{imgClass}}" />';
                if(typeof attr.nolink !== 'undefined')
                    return img;

                return '<a ui-sref="family.members.profile({user: user.id})" class="{{aClass}}" title="{{user.display_name}}">'+img+'</a>';
            },
            link: function(scope, element, attrs) {
                scope.$watch('user', function() {
                    if(scope.user === undefined)
                        return;

                    var sizes = ['small', 'thumb', 'medium', 'large', 'card'];
                    var size = attrs.size;
                    if(typeof scope === 'undefined')
                        size = 'thumb';
                    else
                        size = sizes.indexOf(size) >= 0 ? size : 'thumb';

                    if(scope.user.image === null || scope.user.image === undefined) {
                        if(size != 'small' && size != 'thumb')
                            size = 'full';
                        var src = 'assets/images/common/'+size+'-default-profile.jpg';
                    }
                    else
                        var src = scope.user.image[size];

                    if(typeof attrs.imgClass !== 'undefined')
                        scope.imgClass = attrs.imgClass;
                    if(typeof attrs.aClass !== 'undefined')
                        scope.aClass = attrs.aClass;

                    scope.imgSource = src;
                });
            }
        }

    }
})();