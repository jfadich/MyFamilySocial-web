;(function () {

    function ForumService(api, API_URL){
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

        self.addReply = function(thread, comment) {
            return self.postPromise('topic/' + thread, { comment: comment});
        };

        self.addThread = function(thread) {
            return self.postPromise('topic/', {
                title: thread.title,
                body: thread.body,
                category: thread.category
            });
        };

        self.getPromise = function(endpoint) {
            if(endpoint === undefined)
                endpoint = '';

            return api.get(self.url(endpoint)).
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

            return api.post('/forum/' + endpoint, data)
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

            if(endpoint.indexOf(API_URL) === 0)
                path = endpoint;
            else
                path = '/forum/' + endpoint;

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
