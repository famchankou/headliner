(function () {
	'use strict';


	angular
		.module('headliner')
		.config(configure)
		.run(runBlock);

	configure.$inject = ['$stateProvider',
						'$urlRouterProvider',
						'$locationProvider',
						'$httpProvider',
						'$animateProvider',
						'$mdThemingProvider'];

	function configure($stateProvider, $urlRouterProvider, $locationProvider, $httpProvider, $animateProvider, $mdThemingProvider) {
		$mdThemingProvider.theme('dark-blue').backgroundPalette('blue').dark();
		// Fix ng-repeat and ng-animate bug with stale items
		$animateProvider.classNameFilter(/^((?!(repeat-modify)).)*$/);

		$locationProvider.hashPrefix('!');
		// This is required for Browser Sync to work poperly
		$httpProvider.defaults.headers.common['X-Requested-With'] = 'XMLHttpRequest';

		$urlRouterProvider
			.otherwise('/articles');
	}

	runBlock.$inject = ['$rootScope', '$state', '$window', '$location', '$anchorScroll'];

	function runBlock($rootScope, $state, $window, $location, $anchorScroll) {
		'use strict';

		$rootScope.$on('$stateChangeSuccess', function() {
		   document.body.scrollTop = document.documentElement.scrollTop = 0;
		});

		$rootScope.$on("$stateChangeError", function(event, toState, toParams, fromState, fromParams, error) {
			if (error === "AUTH_REQUIRED") {
		    	$state.go("home.articles");
		    }
		});
	}


})();
