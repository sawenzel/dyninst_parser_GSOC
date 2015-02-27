'use strict';

/**
 * @ngdoc overview
 * @name candyUiApp
 * @description
 * # candyUiApp
 *
 * Main module of the application.
 */
angular
    .module('candyUiApp', [
        'ngAnimate',
        'ngCookies',
        'ngResource',
        'ngRoute',
        'ngSanitize',
        'ngTouch',
        'ui.bootstrap'
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/graph', {templateUrl: 'views/graph.html', controller: 'GraphCtrl'}).
                when('/asm', {templateUrl: 'views/asm.html', controller: 'AsmCtrl'}).
                otherwise({redirectTo: '/asm'});
        }]);