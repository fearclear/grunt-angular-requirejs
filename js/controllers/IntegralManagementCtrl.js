define(['app'], function (app) {
    return app.controller('IntegralManagementCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService',
        function ($scope, $rootScope, serverService, $cookies) {
            $rootScope.itemTitles = [];
        }])
})