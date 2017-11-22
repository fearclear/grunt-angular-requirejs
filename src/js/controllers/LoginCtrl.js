define(['app', 'storage'], function (app, storage) {
  return app.controller('LoginCtrl', ['$scope', '$rootScope', 'serverService', '$location', '$timeout', 'baseService',
    function ($scope, $rootScope, serverService, $location, $timeout) {
      $scope.user = {};
      $scope.user.isRem = false;
      $scope.user.name = localStorage.getItem('__user__') || '';
      $rootScope.pageNow = 'login';
      if ($scope.user.name) {
        $scope.user.isRem = true;
      }
      $scope.login = function () {
        if ($scope.user.name && $scope.user.password) {
          login();
        } else {
          $rootScope.errText = '请输入用户名或密码';
          $rootScope.isError = true;
        }
      };

      function login() {
        showLoading();
        var isFirst = true;
        if (isFirst) {
          isFirst = false;
          serverService.login($scope.user).then(function (data) {
            hideLoading();
            $scope.user = {};
            isFirst = true;
            if (data.userId != null) {
              storage.local.setItem(storage.KEY.USERINFO, data)
              if (/admin/.test(data.authority)) {
                $rootScope.isAdmin = true;
              } else {
                $rootScope.isAdmin = false
              }
              $rootScope.username = data.userName
              serverService.changeToken(data.userId)
              $location.path('/positionInformation').replace();
            } else {
              $rootScope.errText = '请登录';
              $rootScope.isError = true;
            }
          }, function (err) {
            $scope.$emit('rejectError', err)
            $scope.user = {};
            isFirst = true;
          });
        }
      }

      $scope.submit = function () {
        if (!$scope.user.oldPassword || !$scope.user.newPassword || !$scope.user.confirmPassword) {
          $rootScope.errText = '请填写完整信息';
          $rootScope.isError = true;
        }
        serverService.changePassword($scope.user.oldPassword, $scope.user.newPassword, $scope.user.confirmPassword).then(function (data) {
          $rootScope.errText = '修改成功';
          $rootScope.isError = true;
          window.location = '#/';
        }, function (err) {
          $scope.$emit('rejectError', err)
        });
      }
      /*
                  document.addEventListener('keydown', pushLogin);
                  function pushLogin(ev) {
                      if (ev.keyCode == '13' && $location.$$url == '/login' && $scope.user.name && $scope.user.password) {
                          login();
                      }else if($location.$$url != '/login'){
                          document.removeEventListener('keydown', pushLogin)
                      }
                  }*/
    }]);
});