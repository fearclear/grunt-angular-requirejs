define(['app'], function (app) {
    return app.controller('PositionManagementCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$state', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, $state) {
            $rootScope.pageNow = 'positionManagement';
            $rootScope.isPagination = false;
            $rootScope.title = '持仓管理';
            $location.path($rootScope.positionManagement.pageNow).replace();
        }])
})