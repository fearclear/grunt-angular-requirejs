define(['app'], function (app) {
    return app.controller('ValuationManagementCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location) {
            $rootScope.title = '估值管理';
            $rootScope.pageNow = 'valuationManagement';
            $rootScope.isPagination = false;
            $location.path('vmReport').replace()
        }])
})