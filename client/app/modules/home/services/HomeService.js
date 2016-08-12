(function () {
	'use strict';


	angular.module('headliner')
		.factory('homeService', homeService);

	homeService.$inject = ['$http'];

	function homeService($http) {

		var list = [];

		function getFeaturesList() {
			return list;
		}

		return {
			getFeaturesList: getFeaturesList
		};

	}

})();
