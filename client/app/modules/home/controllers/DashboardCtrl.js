(function () {
	'use strict';

	
	angular
		.module('headliner')
		.controller('dashboardCtrl', dashboard);

	dashboard.$inject = ['$timeout', 
						'$q', 
						'$log', 
						'$mdSidenav', 
						'$cookies', 
						'$state', 
						'$mdToast', 
						'$mdDialog', 
						'articlesModel', 
						'pagerService', 
						'utilsService',
						'currentAuth'];

	function dashboard($timeout, $q, $log, $mdSidenav, $cookies, $state, $mdToast, $mdDialog, articlesModel, pagerService, utilsService, currentAuth) {
		/*jshint validthis: true */

		var table = this;
		table.articlesArray = [];
		table.items = [];
		table.pager = {};
		table.loading = true;
		table.getArticles = getArticles;
		table.setPage = setPage;
		table.editArticle = editArticle;


		function getArticles() {
			articlesModel.getAllArticlesFB()
				.then(function (result) {
					table.loading = false;
					//$log.debug('DASHBOARD_RESULT', utilsService.objectToArray(result).reverse());
					table.articlesArray = (result !== 'null') ? utilsService.objectToArray(result).reverse() : [];
					initPagerCtrl(1);
					result.$watch(function() {
						initPagerCtrl(1);
					});
                },
                function (error) {
					$log.debug('dashboardCtrl::getArticle', reason);
                });
		}

	    function setPage(page) {
	        if (page < 1 || page > table.pager.totalPages) {
	            return;
	        }
	        table.pager = pagerService.getPager(table.articlesArray.length, page);
	        table.items = table.articlesArray.slice(table.pager.startIndex, table.pager.endIndex + 1);
	    }
	 
	    function initPagerCtrl(page) {
	        table.setPage(page);
	    }

	    function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

	    table.getArticles();

        function editArticle(ev) {

			$mdDialog.show({
				controller: editArticleDialogCtrl,
				templateUrl: 'app/modules/home/templates/edit-dialog.html',
				parent: angular.element(document.body),
				clickOutsideToClose:false
			})
			.then(function(val) {
				$mdToast.show(
					$mdToast.simple()
					.content(val)
					.position('top left')
					.hideDelay(1000)
				);

			}, function() {
				$mdToast.show(
					$mdToast.simple()
					.content('Cancelled')
					.position('top left')
					.hideDelay(1000)
				);
			});

			function editArticleDialogCtrl($log, $scope, $mdDialog, articlesModel) {
				var dialog = this;
				var IMAGE_PATH = 'app/assets/images/';
				dialog.currentArticle = {};

				articlesModel.getArticleByIdFB(ev)
					.then(function (result) {
						//$log.debug('EDIT_DIALOG', utilsService.objectToArray(result).reverse());
						var data = (result !== 'null') ? utilsService.objectToArray(result).reverse() : [];
						for(var i = 0, len = data.length; i < len; i++) {
							if(null === data[i].$id || undefined === data[i].$id) {
								return;
							} else {
								$scope[data[i].$id] = data[i].$value;
							}
						}	
	                },
	                function (error) {
						$log.debug('dashboardCtrl::editArticleDialogCtrl', reason);
	                });

				$scope.cancel = function() {
					$mdDialog.cancel();
				};

				$scope.submit = function(val) {
					var fields = ['headline', 'content', 'publisher', 'sourceLink'];
					
					fields.forEach(function (field) {
						if(undefined === $scope[field]) {
							dialog.currentArticle[field] = null;
						} else {
							dialog.currentArticle[field] = $scope[field];
						}
					});

					if(_.isEmpty($scope.headline) || _.isEmpty($scope.content) || _.isEmpty($scope.publisher)) {
						$mdToast.show(
							$mdToast.simple()
							.content('Please fill in all required fields')
							.position('top left')
							.hideDelay(1000)
						);
						return;
					}

					if(undefined === $scope.imageLink || 0 === $scope.imageLink.length) {
						var rand = getRandomInt(1, 5);
						dialog.currentArticle.imageLink = IMAGE_PATH + 'img' + rand + '.jpg';
					} else {
						if(20 < $scope.imageLink.length) {
							dialog.currentArticle.imageLink = $scope.imageLink;
						} else {
							dialog.currentArticle.imageLink = IMAGE_PATH + $scope.imageLink;
						}
					}

					dialog.currentArticle.createdAt = utilsService.getDateStamp().toString();
					if(undefined === dialog.currentArticle || undefined === ev) {
						return;
					} else {
						articlesModel.updateArticleFB(dialog.currentArticle, ev);
					}
					$mdDialog.hide(val);
				};

				$scope.delete = function(val) {
					articlesModel.deleteArticleFB(ev);
					$mdDialog.hide(val);
				};

				$scope.hide = function() {
					$mdDialog.hide();
				};
			}
		}
	}
})();