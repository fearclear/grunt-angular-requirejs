define(['app'], function (app) {
    return app.controller('RiskManagementCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location) {
            $rootScope.title = '风险管理';
            $rootScope.pageNow = 'riskManagement';
            $rootScope.isPagination = true;
            $rootScope.pageIndex = 1;
            $rootScope.totalCount = 0;
            $rootScope.pageTotal = 1;
            $location.path('/rmSubOrders').replace()
        }])
})