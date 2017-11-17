define(['app', 'storage'], function (app, storage) {
    return app.controller('TransactionKanbanCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$state', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, $state) {
            $rootScope.isPagination = false;
            $rootScope.title = '交易看板';
            $rootScope.name = '产品资金动态';
            $rootScope.fundFundId = 0;
            $location.path('/TKFundFunds').replace();
        }])
})