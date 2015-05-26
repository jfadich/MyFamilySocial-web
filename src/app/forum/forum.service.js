;(function () {

    function ForumService(api){
        var self = this;
        self.pagination;

        self.getThreads = function(includes)
        {
            return self.getPromise('', includes);
        };

        self.getThread = function(slug, includes)
        {
            return self.getPromise('topic/' + slug, includes);
        };

        self.getCategories = function(includes)
        {
            return self.getPromise('categories', includes);
        };

        self.getCategory = function(slug, includes)
        {
            return self.getPromise('categories/' + slug, includes);
        };

        self.addReply = function(thread, comment) {
            return self.postPromise('topic/' + thread, { comment: comment});
        };

        self.deleteReply = function(reply) {
            return api.delete(api.url('/comments/') + reply);
        };

        self.addThread = function(thread) {
            return self.postPromise('topic/', {
                title: thread.title,
                body: thread.body,
                category: thread.category
            });
        };

        self.getPromise = function(endpoint, includes) {
            return api.get(self.url(endpoint, includes)).
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

            return api.post(self.url(endpoint), data)
        };

        self.next = function() {
            if(self.pagination === null || self.pagination.links.next === undefined)
                return null;

            return self.getPromise(self.pagination.links.next);
        };

        self.url = function(endpoint, includes) {
            if (endpoint === undefined)
                endpoint = '/forum/';

            if((endpoint.indexOf("http") !== 0))
                endpoint = '/forum/' + endpoint;

            return api.url(endpoint, includes);
        }
    }

    angular.module('inspinia')
        .service('ForumService', ForumService);


})();
