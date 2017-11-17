define(['app'], function (app) {
    return app.controller('StatisticalReportCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location) {
            $rootScope.title = '统计报表';
            $rootScope.pageNow = 'statisticalReport';
            $rootScope.isPagination = true;
            $rootScope.pageIndex = 1;
            $rootScope.totalCount = 0;
            $rootScope.pageTotal = 1;
            $location.path($rootScope.statistical.pageNow).replace();
        }])
})