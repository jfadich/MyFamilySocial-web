;(function () {

    function ForumService($http, API){
        var self = this;
        self.includes = '';

        self.getThreads = function()
        {
            return self.forumPromise();
        };

        self.getThread = function(slug)
        {
            return self.forumPromise('topic/' + slug);
        };

        self.getCategories = function()
        {
            return self.forumPromise('categories');
        };

        self.getCategory = function(slug)
        {
            return self.forumPromise('categories/' + slug);
        };

        self.forumPromise = function(endpoint) {
            if(endpoint === undefined)
                endpoint = '';

            return $http.get(self.url(endpoint)).
                then(function(response){
                    self.includes = '';
                    return response.data.data;
                }, function(response){
                    console.log(response);
                });
        };

        self.with = function(includes) {
            self.includes = includes;

            return self;
        };

        self.url = function(endpoint) {
            var path = API + '/forum/' + endpoint;

            if(self.includes != '') {
                path = path + '?with=' + self.includes;
            }

            return path;
        };

    }

    angular.module('inspinia')
        .service('ForumService', ForumService);


})();
