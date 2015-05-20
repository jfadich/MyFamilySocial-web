'use strict';

angular.module('inspinia')
  .controller('ForumCtrl', function ($scope, ForumService) {

        $scope.threads = [];
        $scope.categories = [];

        $scope.headerTitle = 'Forum';

        ForumService.getThreads().
            success(function(threads) {
                $scope.threads = threads.data;
            });

        ForumService.getCategories().
            success(function(categories) {
                $scope.categories = categories.data;
            });

        console.log(self);
    });
