define(['app'], function (app) {
    return app.controller('VMReportCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService',
        function ($scope, $rootScope, serverService, $cookies) {
            $rootScope.pageNow = 'vmReport';
            $rootScope.title = '估值管理';
            $rootScope.name = '估值报表'
            $rootScope.isPagination = false;
            $scope.vmDate = new Date().Format('yyyy-MM-dd');
            $scope.staticValue = new Date().Format('yyyy-MM-dd');
            function getHoldingStatus(date) {
                showLoading();
                serverService.getHoldingStatus(date)
                    .then(function (data) {
                        hideLoading();
                        data.holdingStatus.forEach(function (i) {
                            i.isSetCash = false;
                            i.cash = +i.cash;
                        })
                        $scope.items = data.holdingStatus;
                        $scope.reportResult = data.reportStatus;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            getWorkDay();
            function getWorkDay() {
                serverService.getWorkDay(new Date().Format('yyyy-MM-dd'), -1)
                    .then(function (data) {
                        $scope.vmDate = data.workday;
                        getHoldingStatus($scope.vmDate);
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    });
            }
            $scope.getHolding = function () {
                if(new Date($scope.vmDate.replace(/-/g,'/'))>new Date()){
                    $rootScope.isError = true;
                    $rootScope.errText = '非法日期';
                    $scope.vmDate = new Date().Format('yyyy-MM-dd');
                }
                getHoldingStatus($scope.vmDate);
            }
            $scope.setCash = function (item) {
                item.isSetCash = true;
            }
            $scope.subCash = function (item) {
                item.isSetCash = false;
                item.effectDate = new Date(item.valueDate).Format('yyyy-MM-dd');
                item.amount = item.cash;
                serverService.setAdjustCash(item)
                    .then(function (data) {
                        $rootScope.errText = '修改成功';
                        $rootScope.isError = true;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.downLoad = function (url) {
                if(url){
                    window.location = url;
                }else{
                    $rootScope.errText = '没有数据';
                    $rootScope.isError = true;
                }
            }
            document.addEventListener('click', pushSetCash);
            function pushSetCash(ev) {
                if(ev.target.localName.toUpperCase()!='INPUT' &&ev.target.localName.toUpperCase()!='A' && $rootScope.pageNow == 'vmReport'){
                    if($scope.items){
                        $scope.items.forEach(function (i) {
                            i.isSetCash = false;
                        })
                    }
                }else if($rootScope.pageNow != 'vmReport'){
                    document.removeEventListener('click', pushSetCash)
                }
            }
        }])
})