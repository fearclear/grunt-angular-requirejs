'use strict';

define(['app'], function (app) {
    return app.controller('FundPaymentFlowCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService', function ($scope, $rootScope, serverService, $cookies) {
        $rootScope.pageNow = 'fundPaymentFlow';
        $rootScope.title = '产品管理';
        $rootScope.name = '产品缴款流水';
        $rootScope.isPagination = true;
        $scope.fmFund = {
            maturityOrNot: '未到期'
        }
        $scope.fmS = {}
        function getPayment(pageIndex, pageSize) {
            $rootScope.pageIndex = pageIndex
            showLoading();
            serverService.getPayment(pageIndex, pageSize, $scope.fmS.fundName, $scope.fmS.maturityOrNot, $scope.fmS.startTime, $scope.fmS.endTime)
                .then(function (data) {
                    hideLoading()
                    var count = 0
                    data.listData.forEach(function (i) {
                        i.index = ++count
                    })
                    $scope.gridOptions.data = data.listData
                    $rootScope.pageTotal = Math.ceil(data.totalCount / 15);
                    $rootScope.totalCount = data.totalCount;
                }, function (err) {
                    $scope.$emit('rejectError', err)
                })
        }
        $scope.searchPayment = function () {
            getPayment($rootScope.pageIndex, 15)
        }
        $scope.resetPayment = function () {
            $scope.fmS = {}
        }
        getPayment(1, 15)
        $scope.gridOptions = {
            enableGridMenu: false,
            enableSelectAll: true,
            exporterMenuPdf: false, // ADD THIS
            rowHeight: '42',
            exporterOlderExcelCompatibility: true,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            columnDefs: [
                { enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
                { enableColumnMenu: false, field: 'fundName',displayName: '产品名称', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'waterNumber',displayName: '流水单号', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'productSize',displayName: '产品规模', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'recoveryTime',displayName: '追缴时间', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'extractionTime',displayName: '提取时间', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'term',displayName: '期限', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'expectedRateOfReturn',displayName: '预期收益率(%)', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'daysRemaining',displayName: '剩余天数', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'earlyWarning',displayName: '预警', cellClass: isWarning, type: 'number'},
                { enableColumnMenu: false, field: 'netCostUnit',displayName: '成本单位净值', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'accumulatedInterest',displayName: '累计利息', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'maturityOrNot',displayName: '到期与否', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'nonAccrualCost',displayName: '未到期计提成本', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'retainedProfit',displayName: '已到期留存利润', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'retainedInterest',displayName: '留存利率(%)', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'marginRatio',displayName: '保证金比率(%)', cellClass: 'align_center'},
                { enableColumnMenu: false, field: 'marginAmount',displayName: '保证金金额', cellClass: 'number_type', type: 'number'},
                { enableColumnMenu: false, field: 'handle',displayName: '操作', cellClass: 'main_color align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.showEdit(\'edit\', row.entity)"><span><a href="javascript:;" class="main_color" ng-click="update(item)">修改</a></span></div>'},
            ],
            onRegisterApi: function( gridApi ){
                $scope.gridApi = gridApi;
                gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                    $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                });
            },
            enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
        };
        //新增产品
        $scope.showEdit = function (flag, update) {
            $scope.tempList = {};
            $scope.isEdit = true;
            switch (flag) {
                case 'add':
                    $scope.isUpdate = false; //是否可修改
                    $scope.fmFund.title = '新增成本参数';
                    $scope.fmFund.confirm = '创建';
                    break;
                case 'edit':
                    $scope.isUpdate = true;
                    $scope.fmFund.title = '成本参数修改';
                    $scope.fmFund.confirm = '修改';
                    $scope.fmFund.paymentId = update.paymentId;
                    $scope.fmFund.fundName = ''+update.fundId;
                    $scope.fmFund.waterNumber = update.waterNumber;
                    $scope.fmFund.productSize = update.productSize/10000;
                    $scope.fmFund.recoveryTime = update.recoveryTime;
                    $scope.fmFund.extractionTime = update.extractionTime;
                    $scope.fmFund.term = update.term;
                    $scope.fmFund.expectedRateOfReturn = update.expectedRateOfReturn;
                    $scope.fmFund.daysRemaining = update.daysRemaining;
                    $scope.fmFund.earlyWarning = update.earlyWarning;
                    $scope.fmFund.netCostUnit = update.netCostUnit;
                    $scope.fmFund.accumulatedInterest = update.accumulatedInterest;
                    $scope.fmFund.maturityOrNot = update.maturityOrNot;
                    $scope.fmFund.nonAccrualCost = update.nonAccrualCost;
                    $scope.fmFund.retainedProfit = update.retainedProfit;
                    $scope.fmFund.retainedInterest = update.retainedInterest;
                    $scope.fmFund.marginRatio = update.marginRatio;
                    $scope.fmFund.marginAmount = update.marginAmount/10000;
                    break;
                default:
                    break;
            }
        };

        //确认
        var isFirstClick = true;
        $scope.subEdit = function () {
            if(isFirstClick){
                isFirstClick = false;
                $scope.tempList.paymentId = $scope.fmFund.paymentId || '';
                $scope.tempList.fundId = $scope.fmFund.fundName || '';
                $scope.tempList.waterNumber = $scope.fmFund.waterNumber || '';
                $scope.tempList.productSize = $scope.fmFund.productSize*10000 || '';
                $scope.tempList.recoveryTime = $scope.fmFund.recoveryTime || '';
                $scope.tempList.extractionTime = $scope.fmFund.extractionTime || '';
                $scope.tempList.term = $scope.fmFund.term || '';
                $scope.tempList.expectedRateOfReturn = $scope.fmFund.expectedRateOfReturn || '';
                $scope.tempList.daysRemaining = $scope.fmFund.daysRemaining || '';
                $scope.tempList.earlyWarning = $scope.fmFund.earlyWarning || '';
                $scope.tempList.netCostUnit = $scope.fmFund.netCostUnit || '';
                $scope.tempList.accumulatedInterest = $scope.fmFund.accumulatedInterest || '';
                $scope.tempList.maturityOrNot = $scope.fmFund.maturityOrNot || '';
                $scope.tempList.nonAccrualCost = $scope.fmFund.nonAccrualCost || '';
                $scope.tempList.retainedProfit = $scope.fmFund.retainedProfit || 0;
                $scope.tempList.retainedInterest = $scope.fmFund.retainedInterest || 0;
                $scope.tempList.marginRatio = $scope.fmFund.marginRatio || 0;
                $scope.tempList.marginAmount = $scope.fmFund.marginAmount*10000 || 0;
                if ($scope.tempList.paymentId) {
                    serverService.updatePayment($scope.tempList).then(function () {
                        $rootScope.errText = '修改成功';
                        $rootScope.isError = true;
                        $scope.fmFund = {
                            maturityOrNot: '未到期'
                        };
                        $scope.tempList = {};
                        $scope.isEdit = false;
                        getPayment($rootScope.pageIndex, 15);
                        isFirstClick = true;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                        isFirstClick = true;
                    });
                } else {
                    serverService.addPayment($scope.tempList).then(function () {
                        $rootScope.errText = '创建成功';
                        $rootScope.isError = true;
                        $scope.fmFund = {
                            maturityOrNot: '未到期'
                        };
                        $scope.tempList = {};
                        $scope.isEdit = false;
                        getPayment($rootScope.pageIndex, 15);
                        isFirstClick = true;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                        isFirstClick = true;
                    });
                }
            }
        };
        $scope.cancelEdit = function () {
            $scope.fmFund = {
                maturityOrNot: '未到期'
            }
            $scope.tempList = {}
            $scope.isEdit = false
        }

        //计算
        $scope.calculate = function () {
            var dateNow = new Date()
            dateNow.setHours(0)
            dateNow.setMinutes(0)
            dateNow.setSeconds(0)
            dateNow.setMilliseconds(0)
            dateNow = dateNow.getTime()
            if($scope.fmFund.extractionTime){
                $scope.fmFund.daysRemaining = Math.ceil((new Date($scope.fmFund.extractionTime.replace(/-/g, '/')).getTime()-dateNow)/(24*60*60*1000))
                $scope.fmFund.tempComputeDay = Math.ceil((dateNow-new Date($scope.fmFund.recoveryTime.replace(/-/g, '/')).getTime())/(24*60*60*1000))
                $scope.fmFund.earlyWarning = $scope.fmFund.daysRemaining>=0?$scope.fmFund.daysRemaining:0
                if($scope.fmFund.daysRemaining<=0){
                    $scope.fmFund.maturityOrNot = '已到期'
                }else{
                    $scope.fmFund.maturityOrNot = '未到期'
                }
            }
            if($scope.fmFund.recoveryTime && $scope.fmFund.extractionTime){
                $scope.fmFund.term = (new Date($scope.fmFund.extractionTime.replace(/-/g, '/')).getTime()-new Date($scope.fmFund.recoveryTime.replace(/-/g, '/')).getTime())/(24*60*60*1000)
            }
            if($scope.fmFund.recoveryTime && $scope.fmFund.expectedRateOfReturn && $scope.fmFund.tempComputeDay){
                $scope.fmFund.netCostUnit = ($scope.fmFund.tempComputeDay*$scope.fmFund.expectedRateOfReturn/100/365+1).toFixed(4)
            }
            if($scope.fmFund.productSize && $scope.fmFund.recoveryTime && $scope.fmFund.expectedRateOfReturn && $scope.fmFund.tempComputeDay){
                $scope.fmFund.accumulatedInterest = ($scope.fmFund.productSize*10000*($scope.fmFund.tempComputeDay*$scope.fmFund.expectedRateOfReturn/100/365)).toFixed(0)
            }
            if($scope.fmFund.productSize && $scope.fmFund.recoveryTime && $scope.fmFund.expectedRateOfReturn && $scope.fmFund.tempComputeDay){
                $scope.fmFund.nonAccrualCost = $scope.fmFund.maturityOrNot=='已到期'?0:($scope.fmFund.productSize*10000+$scope.fmFund.productSize*10000*$scope.fmFund.tempComputeDay*$scope.fmFund.expectedRateOfReturn/100/365).toFixed(2)
            }
            if($scope.fmFund.productSize && $scope.fmFund.term && $scope.fmFund.retainedInterest && $scope.fmFund.expectedRateOfReturn){
                $scope.fmFund.retainedProfit = $scope.fmFund.retainedInterest?($scope.fmFund.productSize*10000*$scope.fmFund.term/365*($scope.fmFund.expectedRateOfReturn/100-$scope.fmFund.retainedInterest/100)).toFixed(2):0
            }
            if($scope.fmFund.productSize && $scope.fmFund.marginRatio){
                $scope.fmFund.marginAmount = $scope.fmFund.maturityOrNot=='已到期'?0:($scope.fmFund.productSize*10000*$scope.fmFund.marginRatio/100/10000)
            }
        }
        $scope.params = {
            maturity: [
              {
                  code: '未到期',
                  name: '未到期',
              },
              {
                  code: '已到期',
                  name: '已到期',
              },
            ]
        }
        //是否报警
        function isWarning(grid, row, col, rowRenderIndex, colRenderIndex) {
            if(grid.getCellValue(row, col) <= 7){
                return 'state_up number_type'
            }else{
                return 'number_type'
            }
        }
        //分页器
        $scope.$on('fundPaymentFlow', function (ev, data) {
            getFund(data.pageIndex, 1000);
        });
    }])
});