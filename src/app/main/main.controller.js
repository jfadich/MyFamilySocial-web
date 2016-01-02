;(function () {

angular.module('MyFamilySocial')
  .controller('MainCtrl', function ($scope, UserService, auth, $state) {
        var self = this;

        // Detect Mobile Browser
        if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
            angular.element('html').addClass('ismobile');
        }

        // For Main menu Active Class
        self.$state = $state;

        // By default Sidebars are hidden in boxed layout and in wide layout only the right sidebar is hidden.
        this.sidebarToggle = {
            left: false
        };

        self.getUser = function() {
            UserService.getUser('~', 'role').then(function(user){
                self.user = user.data;
                $scope.$on('photos.upload.user.'+self.user.id, function(){
                    self.getUser();
                })
            });
        };

        if(auth.isAuthenticated()) {
            self.getUser();
        }
        $scope.$on('USER_LOGGED_IN', function(event, mass) {
            self.getUser();
        });
        $scope.$on('USER_LOGGED_OUT', function(event, mass) {
            self.user = null;
        });
        $scope.$on('USER_REFRESH', function(event, mass) {
            self.getUser();
        });


        return self;
    })

    // =========================================================================
    // Header
    // =========================================================================
    .controller('headerCtrl', function(){

        // Top Search
        this.openSearch = function(){
            angular.element('#header').addClass('search-toggled');
            angular.element('#top-search-wrap').find('input').focus();
        };

        this.closeSearch = function(){
            angular.element('#header').removeClass('search-toggled');
        }

    })



})();