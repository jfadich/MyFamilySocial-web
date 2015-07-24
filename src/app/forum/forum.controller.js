;(function () {

    function ForumController($scope, $state, categories) {
        var self = this;
        self.categories = categories;
        self.total_posts = categories.meta.total_posts;
        self.threads = [];
        self.all = {
            id:'all',
            name: 'All Discussions',
            description: 'All categories',
            icon: 'fa fa-asterisk'
        };

        $scope.$on("$stateChangeSuccess", function() {
            if($state.params.category_slug !== undefined && $state.params.category_slug !== 'all') {
                angular.forEach(self.categories.data, function(category, key) {
                    if(category.slug == $state.params.category_slug){
                        self.currentCategory = category;
                    }
                });
            }
            else
                self.currentCategory = $scope.all;
        });

        return self;
    }

    function AddThreadController($scope, ForumService, toastr, $state, categories, TagService) {
        $scope.categories = categories.data;
        $scope.headerTitle = 'Add new Post';
        $scope.breadcrumbs = [{title: 'Forum', link: '#/discussions'},
            { title: 'Create Topic', link: '#/discussions/new'}];


    }

    angular.module('inspinia')
        .controller('ForumCtrl', ForumController)
        .controller('AddThreadCtrl', AddThreadController);

})();


