(function() {
    'use strict';


    angular
        .module('headliner')
        .service('articlesModel', articlesModel);

        articlesModel.$inject = ['$q', '$http', 'endpointConfigService', 'utilsService'];

        function articlesModel($q, $http, endpointConfigService, utilsService) {
            /*jshint validthis: true */
            
            ///////////////////////////////////////////////
            /////////////////// REST API //////////////////
            ///////////////////////////////////////////////
            var MODEL = '/articles/',
                PARENT = 'headliner',
                CHILD = 'articles',
                articles = {};

            var service = {
                getAllArticles: getAllArticles,
                getAllCachedArticles: getAllCachedArticles,
                getArticleById: getArticleById,
                createNewArticle: createNewArticle,
                updateArticleById: updateArticleById,
                deleteArticleById: deleteArticleById,
                getAllArticlesFB: getAllArticlesFB,
                getArticleByIdFB: getArticleByIdFB,
                createNewArticleFB: createNewArticleFB,
                updateArticleFB: updateArticleFB,
                deleteArticleFB: deleteArticleFB
            };

            return service;


            function getAllArticles() {
                return $http.get(endpointConfigService.getUrl(
                    MODEL + endpointConfigService.getCurrentFormat()
                )).success(
                    function(data, status, headers, config) {
                        return utilsService.objectToArray(data);
                }).error(
                    function(data, status, headers, config) {
                        console.log(data, 'STATUS: ' + status);
                });
            }

            function getAllCachedArticles() {
                var deferred = $q.defer();

                if(articles) {
                    deferred.resolve(articles);
                } else {
                    $http.get(endpointConfigService.getUrl(
                        MODEL + endpointConfigService.getCurrentFormat()
                    )).success(function(data, status, headers, config) {
                        articles = data;
                        deferred.resolve(articles);
                    }).error(deferred.reject);
                }
                
                return deferred.promise;
            }

            function getArticleById(article_id) {
                return $http.get(
                    endpointConfigService.getUrlForId(MODEL, article_id)
                );
            }

            function createNewArticle(article) {
                return $http.post(
                    endpointConfigService.getUrl(
                        MODEL + endpointConfigService.getCurrentFormat()
                    ),
                    article);
            }

            function updateArticleById(article_id, article) {
                return $http.put(
                    endpointConfigService.getUrlForId(MODEL, article_id, article)
                );
            }

            function deleteArticleById(article_id) {
                return $http.delete(
                    endpointConfigService.getUrlForId(MODEL, article_id)
                );
            }

            ///////////////////////////////////////////////
            ///////////////// FIREBASE API ////////////////
            ///////////////////////////////////////////////

            function getAllArticlesFB() {
                return endpointConfigService.getAllItems(PARENT, CHILD);
            }

            function getArticleByIdFB(id) {
                return endpointConfigService.getItemById(PARENT, CHILD, id);
            }

            function createNewArticleFB(article) {
                return endpointConfigService.createItem(PARENT, CHILD, article);
            }

            function updateArticleFB(article, id) {
                return endpointConfigService.updateItem(PARENT, CHILD, article, id);
            }

            function deleteArticleFB(id) {
                return endpointConfigService.removeItem(PARENT, CHILD, id);
            }
        }
})();