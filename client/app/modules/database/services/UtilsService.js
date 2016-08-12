(function() {
    'use strict';


    angular
        .module('headliner')
        .service('utilsService', utilsService);

        utilsService.$inject = [];

        function utilsService() {
            /*jshint validthis: true */

            var service = {
                objectToArray: objectToArray,
                getTimeStamp: getTimeStamp,
                getDateStamp: getDateStamp,
                updateLocStorage: updateLocStorage,
                getLocStorageData: getLocStorageData
            };

            return service;


            function objectToArray(content) {
                if(null === content || undefined === content) {
                    return;
                }

                if(content instanceof Object && !Array.isArray(content)) {
                    var newArray = [];


                    for (var key in content) {
                        var item = content[key];
                        item.id = key;
                        newArray.push(item);
                    }
                    return newArray;
                } else {
                    return content;
                }
            }

            function getTimeStamp() {
                var now = new Date();
                var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
                var time = [ now.getHours(), now.getMinutes(), now.getSeconds() ];
                var suffix = ( time[0] < 12 ) ? "AM" : "PM";
                time[0] = ( time[0] < 12 ) ? time[0] : time[0] - 12;
                time[0] = time[0] || 12;

                for (var i = 1; i < 3; i++) {
                    if (time[i] < 10) {
                        time[i] = "0" + time[i];
                    }
                }

                return date.join("/") + " " + time.join(":") + " " + suffix;
            }

            function getDateStamp() {
                var now = new Date();
                var date = [ now.getMonth() + 1, now.getDate(), now.getFullYear() ];
                return date.join("/");
            }

            function updateLocStorage(key, value) {
                if (window.localStorage && undefined !== key) {
                    localStorage.setItem(key, angular.toJson(value));
                }
                return value;
            }

            function getLocStorageData(key) {
                if(undefined === key) {
                    console.log('utilsService::getLocStorageData => No key specified to retrieve data from localStorage');
                    return;
                } else {
                    var data = angular.fromJson(localStorage.getItem(key));
                    return data ? data : {};
                }
            }
        }
})();
