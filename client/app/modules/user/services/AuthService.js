(function() {
	'use strict';

	angular
		.module('headliner')
		.factory('authService', authService);

	authService.$inject = ['$firebase', '$firebaseAuth', 'endpointConfigService'];

	function authService(firebase, $firebaseAuth, endpointConfigService) {
		/*jshint validthis: true */

		var fbAuth = $firebaseAuth();
		var getAuth = fbAuth.$getAuth();

		var authObj = {
			getAuth: getAuth,
			authRef: fbAuth
		};

		return authObj;
	}

})();