;(function () {

    function ForumController($scope, $state, categories, ForumService) {
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
            if($state.params.category_slug !== undefined && $state.params.category_slug !== '') {
                angular.forEach(self.categories.data, function(category) {
                    if(category.slug == $state.params.category_slug){
                        self.currentCategory = category;
                    }
                });
            }
            else {
                self.currentCategory = self.all;
            }
            if($state.current.name == 'family.forum') {
                return $state.go('family.forum.category')
            }
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


