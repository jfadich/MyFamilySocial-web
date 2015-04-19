'use strict';

angular.module('inspinia')
  .controller('ForumCtrl', function ($scope, $http) {

        $scope.threads = [];
        $scope.headerTitle = 'Forum';
        $http.get('http://myfamily.dev/forum?with=owner,tags').
            success(function(threads) {
                $scope.threads = threads.data;console.log(threads);
            }).
            error(function(data){
                console.log(data);
            });

        $http.get('http://myfamily.dev/forum/categories').
            success(function(threads) {
                $scope.categories = threads.data;console.log(threads);
            }).
            error(function(data){
                console.log(data);
            });
    });
