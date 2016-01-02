;(function () {

    angular.module('MyFamilySocial')
        .controller('ForumCtrl', ForumController);

    function ForumController($scope, $state, categories) {
        var self = this;
        self.categories = categories;
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
        });

        return self;
    }

})();


