(function () {
	'use strict';


	angular
		.module('headliner')
		.controller('itemCtrl', itemCtrl);

	
	itemCtrl.$inject = ['$scope', '$sce', '$stateParams', 'utilsService', 'articlesModel'];

	function itemCtrl($scope, $sce, $stateParams, utilsService, articlesModel) {
		/*jshint validthis: true */
		
		var item = this;
		item.id = $stateParams.articleId;
		item.loading = true;

		if(undefined !== item.id) {
			articlesModel.getArticleByIdFB(item.id)
			.then(function (result) {
				item.loading = false;
				//console.log('ITEM_PAGE', utilsService.objectToArray(result).reverse());
				var data = (result !== 'null') ? utilsService.objectToArray(result).reverse() : [];
				for(var i = 0, len = data.length; i < len; i++) {
					if(null === data[i].$id || undefined === data[i].$id) {
						return;
					} else {
						if('content' === data[i].$id) {
							/**
							 * TODO: Preprocess the content output
							 */
							var output, content = data[i].$value;
							item.content = content;
						} else {
							item[data[i].$id] = data[i].$value;
						}
					}
				}	
			},
			function (error) {
				console.log('itemCtrl::getArticleByIdFB', reason);
			});
		} else {
			console.log('itemCtrl::getArticleByIdFB => No article ID provided');
		}
	}
})();