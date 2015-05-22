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

        this.getCategories = function()
        {
            return $http.get(API + '/forum/categories').
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
