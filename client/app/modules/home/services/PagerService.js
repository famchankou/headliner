(function () {
    'use strict';


    angular
        .module('headliner')
        .factory('pagerService', pagerService);

    pagerService.$inject = [];

    function pagerService() {

        function getPager(totalItems, currentPage, pageSize) {
            currentPage = currentPage || 1;
            pageSize = pageSize || 10;

            var totalPages = Math.ceil(totalItems / pageSize);
            var startPage, endPage;

            if (totalPages <= 10) {
                startPage = 1;
                endPage = totalPages;
            } else {
                if (currentPage <= 6) {
                    startPage = 1;
                    endPage = 10;
                } else if (currentPage + 4 >= totalPages) {
                    startPage = totalPages - 9;
                    endPage = totalPages;
                } else {
                    startPage = currentPage - 5;
                    endPage = currentPage + 4;
                }
            }

            var startIndex = (currentPage - 1) * pageSize;
            var endIndex = Math.min(startIndex + pageSize - 1, totalItems - 1);
            var pages = _.range(startPage, endPage + 1);

            return {
                totalItems: totalItems,
                currentPage: currentPage,
                pageSize: pageSize,
                totalPages: totalPages,
                startPage: startPage,
                endPage: endPage,
                startIndex: startIndex,
                endIndex: endIndex,
                pages: pages
            };
        }

        return {
            getPager: getPager
        };
    }

})();