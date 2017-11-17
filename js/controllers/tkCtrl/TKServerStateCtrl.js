define(['app', 'storage'], function (app, storage) {
  return app.controller('TKServerStateCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$interval', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $location, $interval) {
      $rootScope.pageNow = 'tkServerState';
      $rootScope.title = '交易看板';
      $rootScope.name = '服务状态管理';
      $rootScope.isPagination = false
      getServerList()
      function getServerList() {
        showLoading()
        serverService.getServerList()
          .then(function (data) {
            $scope.serverList = data
          })
      }
      $scope.restartState = function (item) {
        serverService.restartServer(item)
          .then(function (data) {
            $rootScope.isError = true
            $rootScope.errText = '操作成功'
            getServerList()
          })
      }
    }])
})