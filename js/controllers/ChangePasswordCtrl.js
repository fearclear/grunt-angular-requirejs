define(['app'], function (app) {
    return app.controller('ChangePasswordCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$timeout', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, $timeout) {
            $rootScope.pageNow = 'changePassword';
            $scope.submit = function () {
                if (!$scope.user.oldPassword || !$scope.user.newPassword || !$scope.user.confirmPassword) {
                    $rootScope.errText = '请填写完整信息';
                    $rootScope.isError = true;
                }
                serverService.changePassword($scope.user.oldPassword, $scope.user.newPassword, $scope.user.confirmPassword).then(function (data) {
                    $rootScope.errText = '修改成功';
                    $rootScope.isError = true;
                    $scope.$emit('getParams', {})
                    $location.path('/login').replace();
                }, function (err) {
                    $scope.$emit('rejectError', err)
                });
            }
            document.addEventListener('keydown', changePassword);
            function changePassword(ev) {
                if (ev.keyCode == '13' && $location.$$url == '/login' && $scope.user.name && $scope.user.password) {
                    $scope.submit();
                }else if($location.$$url != '/changePassword'){
                    document.removeEventListener('keydown', changePassword)
                }
            }
        }]);
});