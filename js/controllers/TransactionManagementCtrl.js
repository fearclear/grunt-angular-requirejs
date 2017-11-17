'use strict';

define(['app'], function (app) {
    return app.controller('TransactionManagementCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService', function ($scope, $rootScope, serverService, $cookies, $location) {
        $rootScope.title = '交易管理';
        $rootScope.isPagination = true;
        $location.path('/tmOwn').replace();
    }]);
});