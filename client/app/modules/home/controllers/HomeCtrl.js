(function () {
	'use strict';


	angular
		.module('headliner')
		.controller('homeCtrl', home);

	home.$inject = ['$log', 
					'$mdSidenav', 
					'$cookies', 
					'$state', 
					'$mdToast', 
					'$mdDialog', 
					'homeService', 
					'articlesModel', 
					'utilsService', 
					'authService',
					'userService'];

	function home($log, $mdSidenav, $cookies, $state, $mdToast, $mdDialog, homeService, articlesModel, utilsService, authService, userService) {
		/*jshint validthis: true */
		
		var homeGrid = this;
		homeGrid.toggleSidenav = toggleSidenav;
		homeGrid.addNewArticle = addNewArticle;
		homeGrid.goToDashboard = goToDashboard;
		homeGrid.goToArticlesGrid = goToArticlesGrid;
		homeGrid.logOut = logOut;
		homeGrid.logIn = logIn;
		homeGrid.openMenu = openMenu;
		homeGrid.isLoggedIn = isLoggedIn;
		homeGrid.theUser = userService.getCurrentUser();
		homeGrid.allUsers = userService.getUser();
		homeGrid.getAuth = authService.authRef.$getAuth();
		homeGrid.tmpID = String;

		

		function toggleSidenav(menuId) {
			$mdSidenav(menuId).toggle();
		}

		function getRandomInt(min, max) {
		    return Math.floor(Math.random() * (max - min + 1)) + min;
		}

		function addNewArticle(ev) {
			$mdDialog.show({
				controller: addNewDialogCtrl,
				templateUrl: 'app/modules/home/templates/add-new-dialog.html',
				parent: angular.element(document.body),
				targetEvent: ev,
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

			function addNewDialogCtrl($log, $scope, $mdDialog, articlesModel) {
				var dialog = this;
				var IMAGE_PATH = 'app/assets/images/';
				dialog.currentArticle = {};

				dialog.createArticle = function () {
		            articlesModel.createNewArticleFB(dialog.currentArticle)
		                .then(function (result) {
		                    //$log.debug('RESULT', result);
		                }, function (reason) {
		                    $log.debug('homeCtrl::createArticle', reason);
		                });
		        };

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
						dialog.currentArticle.imageLink = IMAGE_PATH + $scope.imageLink;
					}
					
					dialog.currentArticle.createdAt = utilsService.getDateStamp().toString();
		            dialog.createArticle();
					$mdDialog.hide(val);
				};

				$scope.hide = function() {
					$mdDialog.hide();
				};
			}
		}

		function goToDashboard($scope, ev) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
		}

		function goToArticlesGrid($scope, ev) {
			$scope.hide = function() {
				$mdDialog.hide();
			};
		}

		function logOut() {

			if(authService.authRef.$getAuth()) {
				var currUser = userService.getCurrentUser();
				homeGrid.tmpID = currUser.fbID;
			} else {
				$state.go('login');
			}

			userService.clearCurrent();
		    if(homeGrid.tmpID) {
		      userService.userOffline(homeGrid.tmpID);
		    } 
		    
		    authService.authRef.$signOut();
			$state.go('home.articles', {}, {reload: false});
		}

		function logIn() {
			$state.go('home.login', {}, {reload: false});
		}

		var originatorEv;
		function openMenu($mdOpenMenu, ev) {
			originatorEv = ev;
			$mdOpenMenu(ev);
		}

		function isLoggedIn() {
			var user = authService.authRef.$getAuth();
			return (null !== user && undefined !== user.uid) ? true : false;
		}

	}

})();