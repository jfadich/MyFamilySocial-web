
angular.module('inspinia')

    .service('ForumService', function($http, API){

        this.getThreads = function()
        {
            return $http.get(API + '/forum?with=owner,tags').
                error(function(data){
                    console.log(data);
                });
        };

        this.getCategories = function()
        {
            return $http.get(API + '/forum/categories').
                error(function(data){
                    console.log(data);
                });
        }

    });