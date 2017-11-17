define(['app'], function (app) {
    return app.controller('CMRiskPreviewCtrl',['$scope', '$rootScope', 'serverService', '$cookies', 'baseService',
        function ($scope, $rootScope, serverService, $cookies) {
            $rootScope.title = '信用管理';
            $rootScope.pageNow = 'cmRiskPreview';
            $rootScope.willDone()
        }])
})