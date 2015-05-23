;(function () {

    function ForumService($http, API){

        this.getThreads = function()
        {
            return $http.get(API + '/forum?with=owner,tags').
                then(function(response){
                    return response.data.data;
                },function(response){
                    console.log(response);
                });
        };

        this.getThread = function(slug)
        {
            return $http.get(API + '/forum/topic/' + slug + '?with=replies,replies.owner,category,owner').
                then(function(response){
                    return response.data.data;
                }, function(response){
                    console.log(response);
                });
        };

        this.getCategories = function()
        {
            return $http.get(API + '/forum/categories').
                then(function(response){
                    return response.data.data;
                }, function(response){
                    console.log(response);
                });
        };

        this.getCategory = function(slug)
        {
            return $http.get(API + '/forum/categories/' + slug + '?with=threads').
                then(function(response){
                    return response.data.data;
                }, function(response){
                    console.log(response);
                });
        }
    }

    angular.module('inspinia')
        .service('ForumService', ForumService);


})();
