'use strict';


angular.module('headliner')
	.config(['$stateProvider', function ($stateProvider) {
		$stateProvider
			.state('home', {
				url: '',
				abstract: true,
				templateUrl: 'app/modules/home/templates/home.html',
				controller: 'homeCtrl',
				controllerAs: 'home'
			})
			.state('home.register', {
				url:'/register',
				templateUrl: 'app/modules/user/templates/register.html',
				controller: 'registerCtrl',
				controllerAs: 'registerForm'
			})
			.state('home.login', {
				url:'/login',
				templateUrl: 'app/modules/user/templates/login.html',
				controller: 'loginCtrl',
				controllerAs: 'loginForm'
			})
			.state('home.articles', {
				url:'/articles',
				templateUrl: 'app/modules/frontend/templates/articles.html',
				controller: 'articlesCtrl',
				controllerAs: 'articles'
			})
			.state('home.item', {
				url:'/articles/item/:articleId',
				templateUrl: 'app/modules/frontend/templates/item.html',
				controller: 'itemCtrl',
				controllerAs: 'item'
			})
			.state('home.dashboard', {
				url:'/dashboard',
				templateUrl: 'app/modules/home/templates/dashboard.html',
				controller: 'dashboardCtrl',
				controllerAs: 'dashboard',
				resolve: {
					"currentAuth": ["Auth", function(Auth) {
						return Auth.$requireSignIn();
					}]
				}
			});
	}]
);
