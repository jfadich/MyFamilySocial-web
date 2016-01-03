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
        self.sidebarToggle = {
            left: false
        };

        //Listview menu toggle in small screens
        self.lvMenuStat = false;

        //Close sidebar on click
        self.dismissSidebar = function(event) {
            if (!angular.element(event.target).parent().hasClass('active')) {
                self.sidebarToggle.left = false;
            }
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

        //Skin Switch
        self.currentSkin = 'blue';

        self.skinList = [
            'lightblue',
            'bluegray',
            'cyan',
            'teal',
            'green',
            'orange',
            'blue',
            'purple'
        ];

        self.skinSwitch = function (color) {
            self.currentSkin = color;
        };

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
        };

        return this;

    })


    // =========================================================================
    // MAINMENU COLLAPSE
    // =========================================================================

    .directive('toggleSidebar', function(){

        return {
            restrict: 'A',
            scope: {
                modelLeft: '=',
                modelRight: '='
            },

            link: function(scope, element, attr) {
                element.on('click', function(){

                    if (element.data('target') === 'mainmenu') {
                        if (scope.modelLeft === false) {
                            scope.$apply(function(){
                                scope.modelLeft = true;
                            })
                        }
                        else {
                            scope.$apply(function(){
                                scope.modelLeft = false;
                            })
                        }
                    }

                    if (element.data('target') === 'chat') {
                        if (scope.modelRight === false) {
                            scope.$apply(function(){
                                scope.modelRight = true;
                            })
                        }
                        else {
                            scope.$apply(function(){
                                scope.modelRight = false;
                            })
                        }

                    }
                })
            }
        }

    })



    // =========================================================================
    // SUBMENU TOGGLE
    // =========================================================================

    .directive('toggleSubmenu', function(){

        return {
            restrict: 'A',
            link: function(scope, element, attrs) {
                element.click(function(){
                    element.next().slideToggle(200);
                    element.parent().toggleClass('toggled');
                });
            }
        }
    })

    // =========================================================================
    // PRINT
    // =========================================================================

    .directive('print', function(){
        return {
            restrict: 'A',
            link: function(scope, element){
                element.click(function(){
                    window.print();
                })
            }
        }
    })

})();