'use strict';

angular.module('inspinia')
  .controller('ForumCtrl', function ($scope, $http) {
        $scope.threads = [];
        this.userName = 'John Fadich';
        this.helloText = 'Welcome to the Forum';
        this.descriptionText = 'It is an application skeleton for a typical AngularJS web app. You can use it to quickly bootstrap your angular webapp projects.';
$scope.headerTitle = 'Forum';
        $http.get('http://myfamily.dev/forum?with=owner,tags').
            success(function(threads) {
                $scope.threads = threads.data;console.log(threads);
            }).
            error(function(data){
                console.log(data);
            });
    });
