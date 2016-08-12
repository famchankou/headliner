(function() {
    'use strict';


    angular
        .module('headliner')
        .constant('CURRENT_BACKEND', 'firebase')
        .constant('FB_URL', 'https://headliner-e8d98.firebaseio.com/')
        .service('endpointConfigService', endpointConfigService);

        endpointConfigService.$inject = ['$timeout', 
                                        '$q', 
                                        '$firebase', 
                                        '$firebaseAuth', 
                                        '$firebaseObject', 
                                        '$firebaseArray', 
                                        '$rootScope', 
                                        'FB_URL', 
                                        'CURRENT_BACKEND'];

        function endpointConfigService($timeout, $q, $firebase, $firebaseAuth, $firebaseObject, $firebaseArray, $rootScope, FB_URL, CURRENT_BACKEND) {
            /*jshint validthis: true */
            
            ///////////////////////////////////////////////
            ////////////// REST API connector /////////////
            ///////////////////////////////////////////////

            var service = this,
                endpointMap = {
                    firebase: { URI: FB_URL, root: 'headliner', format: '.json' }
                },
                currentEndpoint = endpointMap[CURRENT_BACKEND],
                MODEL = 'articles',
                backend = CURRENT_BACKEND;

            service.getUrl = function(model) {
                return currentEndpoint.URI + currentEndpoint.root + model;
            };

            service.getUrlForId = function(model, id) {
                return service.getUrl(model) + id + currentEndpoint.format;
            };

            service.getCurrentBackend = function() {
                return backend;
            };

            service.getCurrentFormat = function() {
                return currentEndpoint.format;
            };

            service.getCurrentURI = function() {
                return currentEndpoint.URI;
            };

            ///////////////////////////////////////////////
            //////////// FIREBASE API connector ///////////
            ///////////////////////////////////////////////

            var FBConfig = (function(firebase) {
                var _config = {
                    apiKey: "AIzaSyCyf-iGKl-ahNGKHGUMCl668oePZPmHtsw",
                    authDomain: "headliner-e8d98.firebaseapp.com",
                    databaseURL: FB_URL,
                    storageBucket: "headliner-e8d98.appspot.com"
                };

                var _init = function(endpoint) {
                    firebase.initializeApp(_config);
                    return firebase.database().ref(endpoint);
                };

                return {
                    init: _init
                };

            })(firebase);

            service.parentEndpoint = {
                headliner: FBConfig.init(currentEndpoint.root)
            };

            service.createItem = function(parent, child, object) {
                var deferred = $q.defer();
                if(undefined === object || undefined === parent || undefined === child) {
                    console.log('EndpointConfigService::createItem => invalid parameters');
                    return;
                }
                
                var collection = $firebaseArray(service.parentEndpoint[parent].child(child));
                return collection.$add(object)
                    .then(function(ref) {
                        deferred.resolve($firebaseObject(ref).$id);
                        return deferred.promise;
                    });
            };

            service.updateItem = function(parent, child, object, id) {
                var deferred = $q.defer();
                if(undefined === id || undefined === object || undefined === parent || undefined === child) {
                    console.log('EndpointConfigService::updateItem => invalid parameters');
                    return;
                }

                var dbObj = $firebaseObject(service.parentEndpoint[parent].child(child).child(id));
                for(var property in object) {
                    dbObj[property] = object[property];
                }
                
                dbObj.$save()
                    .then(function(ref) {
                        deferred.resolve($firebaseObject(ref).$id);
                        return deferred.promise;
                    }, function(error) {
                        console.log('EndpointConfigService::updateItem', error);
                        deferred.reject(error);
                        return deferred.promise;
                    });
            };

            service.removeItem = function(parent, child, id) {
                var deferred = $q.defer();
                if(undefined === id || undefined === parent || undefined === child) {
                    console.log('EndpointConfigService::removeItem => invalid parameters');
                    return;
                }

                var dbObj = $firebaseObject(service.parentEndpoint[parent].child(child).child(id));
                
                dbObj.$remove()
                    .then(function(ref) {
                        deferred.resolve($firebaseObject(ref).$id);
                        return deferred.promise;
                    }, function(error) {
                        console.log('EndpointConfigService::removeItem', error);
                        deferred.reject(error);
                        return deferred.promise;
                    });
            };

            service.getItemById = function(parent, child, id) {
                var deferred = $q.defer();
                if(undefined === id || undefined === parent || undefined === child) {
                    console.log('EndpointConfigService::getItemById => invalid parameters');
                    return;
                }
                var object = $firebaseArray(service.parentEndpoint[parent].child(child).child(id));
                return object.$loaded()
                    .then(function(response) {
                        deferred.resolve(response);
                        return deferred.promise;
                    })
                    .catch(function(error) {
                        console.log('EndpointConfigService::getItemById::FETCH_DATA_ERROR:', error);
                        deferred.reject(error);
                        return deferred.promise;
                    });
            };

            service.getAllItems = function(parent, child) {
                var deferred = $q.defer();
                if(undefined === parent || undefined === child) {
                    console.log('EndpointConfigService::getAllItems => invalid parameters');
                    return;
                }
                var collection = $firebaseArray(service.parentEndpoint[parent].child(child));
                return collection.$loaded()
                    .then(function(response) {
                        deferred.resolve(response);
                        return deferred.promise;
                    })
                    .catch(function(error) {
                        console.log('EndpointConfigService::getAllItems::FETCH_DATA_ERROR:', error);
                        deferred.reject(error);
                        return deferred.promise;
                    });
            };

            ///////////////////////////////////////////////
            /////////////// CALLBACK UPDATERS /////////////
            ///////////////////////////////////////////////

            service.updateOnValue = function(reference) {
                reference.on('value', function(snapshot) {
                    var data = snapshot.val();
                });
            };

            service.updateOnItemChange = function(reference) {
                reference.on('child_changed', function(snapshot) {
                    var data = snapshot.val();
                });
            };

            service.updateOnItemAdded = function(reference) {
                reference.on('child_added', function(snapshot) {
                    var data = snapshot.val();
                });
            };

            service.updateOnItemRemoved = function(reference) {
                reference.on('child_removed', function(snapshot) {
                    var data = snapshot.val();
                });
            };
        }
})();