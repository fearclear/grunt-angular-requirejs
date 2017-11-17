define(['app', 'storage'], function (app, storage) {
    return app.controller('PMControlIndexCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$timeout', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, $timeout) {
            $rootScope.pageNow = 'pmControlIndex';
            $rootScope.isPagination = false;
            $rootScope.positionManagement.pageNow = $rootScope.pageNow;
            $rootScope.title = '持仓管理';
            $rootScope.name = '风控指标';
            $scope.pmS = {}
            $scope.pmFundRate = {}
            $scope.pmKey = 'main'
            $scope.getMainSummary = function (workday) {
                if(workday){
                    showLoading()
                    serverService.getMainSummary(workday)
                        .then(function (data) {
                            $scope.summary = data
                            hideLoading()
                        }, function (err) {
                            $scope.$emit('rejectError', err)
                        })
                }
            }
            if(storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.PMCONTROLINDEXCTRLDATA)){
                $scope.summary = storage.session.getItem(storage.KEY.POSITIONMANAGEMENT.PMCONTROLINDEXCTRLDATA)
                var timer = $timeout(function () {
                    if($scope.summary.workday){
                        $scope.pmS.summaryWorkday = new Date($scope.summary.workday).Format('yyyy-MM-dd')
                    }
                    $timeout.cancel(timer)
                }, 0)
            }
            $scope.goDetail = function (str) {
                storage.session.setItem(storage.KEY.POSITIONMANAGEMENT.PMCONTROLINDEXCTRLDATA, $scope.summary)
                $scope.pmKey = str
                $scope.pmS[str+'Workday']=$scope.pmS.summaryWorkday || ''
                switch (str){
                    case 'spot':
                        $scope.getRiskBond($scope.pmS.summaryWorkday)
                        break
                    case 'ratePlate':
                        $scope.getRatePlate($scope.pmS.summaryWorkday)
                        break
                    case 'funding':
                        $scope.getFunding($scope.pmS.summaryWorkday)
                        break
                    default:
                        break
                }
            }
            $timeout(function () {
                $('.later_show').show()
            }, 1000)
            function getRepoCostPercent() {
                serverService.getRepoCostPercent()
                    .then(function (data) {
                        $scope.repoCostPercent = data
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            getRepoCostPercent()
            //显示编辑回购比状态
            $scope.editRepoCost = function () {
                $scope.isEditRepoCost = true

            }
            //提交回购比
            $scope.subRepoCost = function (value) {
                serverService.updateRepoCostPercent(value)
                    .then(function (data) {
                        $rootScope.isError = true
                        $rootScope.errText = '修改成功'
                        $scope.isEditRepoCost = false
                        $scope.getMainSummary($scope.pmS.summaryWorkday)
                        getRepoCostPercent()
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
        }])
})