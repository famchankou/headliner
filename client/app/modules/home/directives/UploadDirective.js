(function () {
	'use strict';


	angular
	    .module('headliner')
	    .directive('uploadDir', uploadDir);

	function uploadDir() {
		var directive = {
			link: link,
			scope: true,
	        templateUrl: '/app/modules/home/templates/upload.html',
	        restrict: 'EA',
	        replace: true,
	        controller: 'uploadCtrl',
	        controllerAs: 'upload',
	        bindToController: true
	    };

	    return directive;

	    function link(scope, element, attrs) {
	      
	    }
	}
})();