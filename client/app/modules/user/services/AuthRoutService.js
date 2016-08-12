(function() {
    'use strict';


    angular
        .module('headliner')
        .factory('Auth', Auth);

        Auth.$inject = ['$firebaseAuth'];

        function Auth($firebaseAuth) {
            /*jshint validthis: true */

            return $firebaseAuth();
        }
})();