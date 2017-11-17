define([
  'app',
  'storage'
], function (app, storage) {
  'use strict';
  return app
    .directive('modalChart', ['serverService', '$rootScope', function (serverService, $rootScope) {
      return {
        restrict: 'AE',
        templateUrl: 'js/templates/directive/modal-chart.html',
        link: function ($scope, element, attr, ngModel) {

        }
      }
    }])
});