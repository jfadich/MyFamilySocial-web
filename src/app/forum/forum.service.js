;(function () {

    function ForumService($http, API){
        var self = this;
        self.includes = '';
        self.pagination;

        self.getThreads = function()
        {
            return self.getPromise();
        };

        self.getThread = function(slug)
        {
            return self.getPromise('topic/' + slug);
        };

        self.getCategories = function()
        {
            return self.getPromise('categories');
        };

        self.getCategory = function(slug)
        {
            return self.getPromise('categories/' + slug);
        };

        self.getPromise = function(endpoint) {
            if(endpoint === undefined)
                endpoint = '';

            return $http.get(self.url(endpoint)).
                then(function(response){
                    self.pagination = get_recursive(response.data, 'pagination');
                    return response.data;
                }, function(response){
                    console.log(response);
                });
        };

        self.postPromise = function(endpoint, data) {
            if(endpoint === undefined)
                endpoint = '';

            return $http.post(self.url(endpoint), data).
                then(function(response){
                    return response.data;
                }, function(response){
                    console.log(response);
                });
        };

        self.with = function(includes) {
            self.includes = includes;

            return self;
        };

        self.next = function() {
            if(self.pagination === null || self.pagination.links.next === undefined)
                return null;

            return self.getPromise(self.pagination.links.next);
        };

        self.url = function(endpoint) {
            var path;

            if(endpoint.indexOf(API) === 0)
                path = endpoint;
            else
                path = API + '/forum/' + endpoint;

            if(self.includes != '') {
                path += path.indexOf('?') !== -1 ? '&' : '?';
                path += 'with=' + self.includes;
            }

            return path;
        };

    }

    angular.module('inspinia')
        .service('ForumService', ForumService);


})();
