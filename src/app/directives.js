'use strict';

//Directive used to set metisMenu and minimalize button
angular.module('inspinia')
    .directive('sideNavigation', function ($timeout) {
        return {
            restrict: 'A',
            link: function (scope, element) {
                // Call metsi to build when user signup
                scope.$watch('authentication.user', function() {
                    $timeout(function() {
                        element.metisMenu();
                    });
                });

            }
        };
    })
    .directive('minimalizaSidebar', function ($timeout) {
        return {
            restrict: 'A',
            template: '<a class="navbar-minimalize minimalize-styl-2 btn btn-primary " href="" ng-click="minimalize()"><i class="fa fa-bars"></i></a>',
            controller: function ($scope, $element) {
                $scope.minimalize = function () {
                    angular.element('body').toggleClass('mini-navbar');
                    if (!angular.element('body').hasClass('mini-navbar') || angular.element('body').hasClass('body-small')) {
                        // Hide menu in order to smoothly turn on when maximize menu
                        angular.element('#side-menu').hide();
                        // For smoothly turn on menu
                        $timeout(function () {
                            angular.element('#side-menu').fadeIn(500);
                        }, 100);
                    } else {
                        // Remove all inline style from jquery fadeIn function to reset menu state
                        angular.element('#side-menu').removeAttr('style');
                    }
                };
            }
        };
    })
    .directive('pageTitle', function pageTitle($rootScope, $timeout) {
            return {
                link: function(scope, element) {
                    var listener = function(event, toState, toParams, fromState, fromParams) {
                        // Default title - load on Dashboard 1
                        var title = 'INSPINIA | Responsive Admin Theme';
                        // Create your own title pattern
                        if (toState.data && toState.data.pageTitle) title = 'INSPINIA | ' + toState.data.pageTitle;
                        $timeout(function() {
                            element.text(title);
                        });
                    };
                    $rootScope.$on('$stateChangeStart', listener);
                }
            }
        });


