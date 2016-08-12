(function () {
	'use strict';


	angular
		.module('headliner')
		.controller('articlesCtrl', articlesCtrl);


	articlesCtrl.$inject = ['articlesModel', 'pagerService', 'utilsService', '$window'];

	function articlesCtrl(articlesModel, pagerService, utilsService, $window) {
		/*jshint validthis: true */

		var articlesGrid = this;
		articlesGrid.loading = true;
		articlesGrid.articlesArray = [];
		articlesGrid.items = [];
		articlesGrid.pager = {};
		articlesGrid.getArticles = getArticles;
		articlesGrid.setPage = setPage;


		function getArticles() {
			articlesModel.getAllArticlesFB()
				.then(function (result) {
					articlesGrid.loading = false;
					//$log.debug('DASHBOARD_RESULT', utilsService.objectToArray(result).reverse());
					articlesGrid.articlesArray = (result !== 'null') ? utilsService.objectToArray(result).reverse() : [];
					initPagerCtrl(1);
					result.$watch(function() {
						initPagerCtrl(1);
					});
                },
                function (error) {
					$log.debug('articlesCtrl::getArticle', reason);
                });
		}

	    function setPage(page) {
	        if (page < 1 || page > articlesGrid.pager.totalPages) {
	            return;
	        }
			utilsService.updateLocStorage('current_page', page);
	        articlesGrid.pager = pagerService.getPager(articlesGrid.articlesArray.length, page, 12);
	        articlesGrid.items = articlesGrid.articlesArray.slice(articlesGrid.pager.startIndex, articlesGrid.pager.endIndex + 1);
	    }

	    function initPagerCtrl(page) {
			var currPage = utilsService.getLocStorageData('current_page');
			if(undefined === currPage || 0 > currPage || false === Number.isInteger(currPage)) {
				articlesGrid.setPage(page);
			} else {
				articlesGrid.setPage(currPage);
			}
	    }

	    articlesGrid.getArticles();
	}
})();
