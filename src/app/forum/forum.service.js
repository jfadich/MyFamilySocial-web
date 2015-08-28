;(function () {

    angular.module('inspinia')
        .service('ForumService', ForumService);

    function ForumService(api){
        return {
            getThreads: getThreads,
            getThread: getThread,
            getCategories: getCategories,
            getCategory: getCategory,
            addThread: addThread,
            updateThread: updateThread
        };

        function getThreads(includes)
        {
            return api.get(api.url('/forum/', includes));
        }
        function getThread(slug, includes)
        {
            return api.get(api.url('/forum/topic/' + slug, includes));
        }
        function getCategories(includes)
        {
            return api.get(api.url('/forum/categories', includes));
        }
        function getCategory(slug, includes)
        {
            return api.get(api.url('/forum/categories/' + slug, includes));
        }
        function addThread(thread) {
            return api.post(api.url('/forum/topic/'), {
                title: thread.title,
                body: thread.body,
                tags: thread.tags,
                sticky: thread.sticky,
                category: thread.category.data.id
            });
        }
        function updateThread(thread) {
            return api.patch('/forum/topic/' + thread.slug, {
                title: thread.title,
                body: thread.body,
                tags: thread.tags,
                sticky: thread.sticky,
                category: thread.category.data.id
            });
        }
    }

})();
