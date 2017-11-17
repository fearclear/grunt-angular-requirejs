define(['app', 'storage'], function (app, storage) {
  return app.controller('SRPledgeWeightedCtrl',['$scope', '$rootScope', 'serverService', '$timeout', '$cookies', '$location', 'baseService',
    function ($scope, $rootScope, serverService, $timeout, $cookies, $location) {
      $rootScope.pageNow = 'srPledgeWeighted';
      $rootScope.statistical.pageNow = $rootScope.pageNow;
      $rootScope.isPagination = false;
      $rootScope.title = '统计报表';
      $rootScope.name = '质押加权';
      $scope.sr = {};
      $scope.searchMain = function () {
        showLoading()
        serverService.getRepoSummary()
          .then(function (data) {
            hideLoading()
            $scope.sr = data;
          }, function (err) {
            $rootScope.$emit('rejectError', err);
          })
      }
    }])
})