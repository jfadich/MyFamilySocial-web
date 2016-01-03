;(function () {

    function AlbumListController(albums) {
        var self = this;
        self.albums = albums.data;
        return self;
    }

    angular.module('MyFamilySocial')
        .controller('AlbumListCtrl', AlbumListController);

})();