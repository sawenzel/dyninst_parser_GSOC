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
        'googlechart',
        'ui.bootstrap',
        'adaptv.adaptStrap'
    ])
    .config(['$routeProvider',
        function ($routeProvider) {
            $routeProvider.
                when('/graph', {templateUrl: 'views/graph.html', controller: 'GraphCtrl'}).
                when('/asm', {templateUrl: 'views/asm.html', controller: 'AsmCtrl'}).
                when('/diff', {templateUrl: 'views/diff.html', controller: 'DiffCtrl'}).
                otherwise({redirectTo: '/asm'});
        }]).value('googleChartApiConfig', {
        version: '1',
        optionalSettings: {
            packages: ['corechart'],
            language: 'en'
        }
    });