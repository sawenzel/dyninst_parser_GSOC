'use strict';
/**
 * @ngdoc service
 * @name candyUiApp.locationChanger
 * @description
 * # locationChanger
 * Service in the candyUiApp.
 */
angular.module('candyUiApp')
    .service('locationChanger', function ($location, $route, $rootScope) {

        var magicFlag = false;

        this.skipReload = function () {
            var lastRoute = $route.current;
            $rootScope.$on('$locationChangeSuccess', function () {
                if (!magicFlag) {
                    return;
                }
                $route.current = lastRoute;
                magicFlag = false;
            });
            return this;
        };

        this.withoutRefresh = function (url, doesReplace) {
            if (url !== $location.url())
                magicFlag = true;
            if (doesReplace) {
                $location.path(url).replace();
            }
            else {
                $location.path(url || '/');
            }
        };
    });