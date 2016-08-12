(function() {
    'use strict';


    angular
        .module('headliner')
        .factory('userService', userFactory);

        userFactory.$inject = ['$firebaseArray', 'endpointConfigService', 'utilsService'];

        function userFactory($firebaseArray, endpointConfigService, utilsService) {
            /*jshint validthis: true */

            var myFB = endpointConfigService.parentEndpoint.headliner.child('users');
            var fbRef = $firebaseArray(myFB);
            var current = {};
            var userService = {
                addUser: addUser,
                setCurrentUser: setCurrentUser,
                getCurrentUser: getCurrentUser,
                getUser: getUser,
                userOnline: userOnline,
                userOffline: userOffline,
                clearCurrent: clearCurrent
            };

            return userService;


            function addUser(id, username) {
                fbRef.$add({
                    loginId: id,
                    user: username,
                    online: 'false'
                });
            }

            function setCurrentUser(user) {
                if(undefined === user) {
                    console.log('userService::setCurrentUser => No current user to save');
                    return;
                }
                current = user;
                utilsService.updateLocStorage('curr_user', user);
            }

            function getCurrentUser() {
                var userObject;
                if(_.isEmpty(current)) {
                    userObject = utilsService.getLocStorageData('curr_user');
                } else {
                    userObject = current;
                }
                return userObject;
            }

            function getUser() {
                return fbRef;
            }

            function userOnline(id) {
                var theID = fbRef.$getRecord(id);
                theID.online = 'true';
                fbRef.$save(theID);
            }

            function userOffline(id) {
                var theID = fbRef.$getRecord(id);
                theID.online = 'false';
                fbRef.$save(theID);
            }

            function clearCurrent() {
                current = '';
                utilsService.updateLocStorage('curr_user', '');
            }
        }
})();