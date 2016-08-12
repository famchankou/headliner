(function () {
	'use strict';


	angular.module('headliner')
		.factory('dashboardService', dashboardService);

	dashboardService.$inject = ['$http'];

	function dashboardService($http) {

		var list = [];

		function getFeaturesList() {
			return list;
		}

		return {
			getFeaturesList: getFeaturesList
		};

	}

})();
