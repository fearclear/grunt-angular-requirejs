/**
 * taPoolDirective
 */
define(['app'], function (app) {
  return app
    .directive('taTradeTargetPool', ['serverService', '$rootScope', 'i18nService', 'uiGridConstants',
      function (serverService, $rootScope, i18nService, uiGridConstants) {
        return {
          restrict: 'AE',
          templateUrl: 'js/templates/taTemp/taTradeTargetPool.html',
          link: function ($scope, element, attr, ngModel) {
            $rootScope.title = '国债账户';
            $rootScope.name = '期货账户';
            // $rootScope.pageNow = 'taAccountSetting';
            $rootScope.pageIndex = 1;
            $scope.tmFund = {};
            $rootScope.isPagination = false
            getTradeTargetPool(1, 17);
            function getTradeTargetPool(pageIndex, pageSize) {
              $rootScope.pageIndex = pageIndex;
              showLoading();
              serverService.getTradeTargetPool(pageIndex, pageSize).then(function (data) {
                hideLoading();
                var count = 0
                data.listData.forEach(function (i) {
                  i.index = ++count
                })
                $scope.gridOptions2.data = data.listData;
                $rootScope.pageTotal = Math.ceil(data.TotalCount / 17);
                $rootScope.totalCount = data.TotalCount;
              }, function (err) {
                $scope.$emit('rejectError', err)
              });
            }

            //提交表单
            $scope.showEdit = function (flag, update) {
              $scope.tempList = {};
              $scope.isEdit = true;
              switch (flag) {
                case 'add':
                  $scope.isUpdate = false; //是否可修改
                  $scope.tmFund.name = '新增投资合约';
                  $scope.tmFund.confirm = '确认';
                  break;
                case 'edit':
                  $scope.isUpdate = true;
                  $scope.tmFund.name = '交易对手修改';
                  $scope.tmFund.confirm = '修改';
                  $scope.tmFund.id = update.id;
                  $scope.tmFund.title = update.title;
                  $scope.tmFund.qq = update.qq;
                  $scope.tmFund.contact = update.contact;
                  $scope.tmFund.phone = update.phone;
                  break;
                default:
                  break;
              }
            };
            $scope.gridOptions2 = {
              enableGridMenu: false,
              enableSelectAll: true,
              exporterMenuPdf: false, // ADD THIS
              rowHeight: '42',
              exporterOlderExcelCompatibility: true,
              exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
              columnDefs: [
                { width: 50, headerCellClass: 'align_center',enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
                { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'TradeTarget',displayName: '合约号', cellClass: 'align_center'},
                { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'iWindCode',displayName: '万得代码', cellClass: 'align_center'},
                { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'Note',displayName: '备注', cellClass: 'align_center'},
                { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'handle',displayName: '操作', cellClass: 'main_color align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer"><span ng-click="grid.appScope.deleteTradeTargetPool(row.entity)"><a href="javascript:;" class="main_color">删除</a></span></div>'},
              ],
              onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                  $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
                });
              },
              enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
            };

            //确认
            var isFirstClick = true;
            $scope.subPoolEdit = function () {
              if (isFirstClick) {
                isFirstClick = false;
                $scope.tempList.id = $scope.tmFund.id || '';
                $scope.tempList.note = $scope.tmFund.note?encodeURIComponent($scope.tmFund.note):'';
                $scope.tempList.tradeTarget = $scope.tmFund.tradeTarget || '';
                $scope.tempList.iwindcode = $scope.tmFund.iwindcode || '';
                if ($scope.tempList.id) {
                  serverService.updateTradeCounterparty($scope.tempList).then(function () {
                    $rootScope.errText = '修改成功';
                    $rootScope.isError = true;
                    $scope.tmFund = {};
                    $scope.tempList = {};
                    $scope.isEdit = false;
                    getTradeTargetPool($rootScope.pageIndex, 17);
                    isFirstClick = true;
                  }, function (err) {
                    isFirstClick = true;
                    $scope.$emit('rejectError', err)
                  });
                } else {
                  serverService.addTradeTargetPool($scope.tempList).then(function () {
                    $rootScope.errText = '创建成功';
                    $rootScope.isError = true;
                    $scope.tmFund = {};
                    $scope.tempList = {};
                    $scope.isEdit = false;
                    getTradeTargetPool($rootScope.pageIndex, 17);
                    isFirstClick = true;
                  }, function (err) {
                    isFirstClick = true;
                    $scope.$emit('rejectError', err)
                  });
                }
              }
            };
            //删除交易对手
            $scope.deleteTradeTargetPool = function (item) {
              $scope.$emit('chooseResult', {
                str: '确定删除该合约吗？',
                cb: function () {
                  showLoading();
                  serverService.deleteTradeTargetPool(item.TargetId).then(function () {
                    hideLoading();
                    $rootScope.errText = '删除成功';
                    $rootScope.isError = true;
                    getTradeTargetPool($rootScope.pageIndex, 17);
                  }, function (err) {
                    $scope.$emit('rejectError', err)
                  });
                }
              })
            };
            //事件通信
            $scope.$on("tmTraderCounterparty", function (event, data) {
              // 这里取到发送过来的数据 data
              getNbfAccount();
            });
          },
        }
      }])
    .directive('taTreasurySummaries', ['serverService', '$rootScope', '$timeout', 'i18nService', 'uiGridConstants',
      function (serverService, $rootScope, $timeout, i18nService, uiGridConstants) {
        return {
          restrict: 'AE',
          templateUrl: 'js/templates/taTemp/taTreasurySummaries.html',
          link: function ($scope, element, attr, ngModel) {
            $rootScope.title = '国债账户';
            $rootScope.name = '期货账户';
            $rootScope.pageIndex = 1;
            $rootScope.isPagination = false
            $scope.summaryDataList = []
            var startDate = new Date()
            startDate.setMonth(startDate.getMonth()-1)
            startDate = startDate.Format('yyyy-MM-dd')
            var endDate = new Date()
            endDate.setDate(endDate.getDate()-1)
            endDate = endDate.Format('yyyy-MM-dd')
            $scope.typeStyle = '列表模式'
            $scope.changeTypeStyle = function () {
              if($scope.typeStyle === '列表模式'){
                $scope.typeStyle = '视图模式'
              }else {
                $scope.typeStyle = '列表模式'
              }
            }
            $scope.searchForm = {
              accountId: 0,
              startDate: startDate,
              endDate: endDate,
            }
            $scope.getNbfSummaries = function(params) {
              var params = {
                startDate: params&&params.startDate?params.startDate:$scope.searchForm.startDate,
                endDate: params&&params.endDate?params.endDate:$scope.searchForm.endDate,
                accountId: params&&params.accountId?params.accountId:0,
              }
              showLoading()
              serverService.getNbfSummaries(params)
                .then(function (data) {
                  hideLoading()
                  var TotalProfitLossList = []
                  var ActualProfitLossList = []
                  var maxV = 0,
                    minV = 0;
                  data.forEach(function (i) {
                    i.ValueDate = new Date(i.ValueDate).getTime()
                    TotalProfitLossList.push({
                      workday: i.ValueDate,
                      value: (i.TotalProfitLoss/10000).toFixed(4)
                    })
                    ActualProfitLossList.push({
                      workday: i.ValueDate,
                      value: (i.ActualProfitLoss/10000).toFixed(4),
                    })
                    maxV = maxV<i.TotalProfitLoss/10000?i.TotalProfitLoss/10000:maxV
                    maxV = maxV<i.ActualProfitLoss/10000?i.ActualProfitLoss/10000:maxV
                    minV = minV>i.TotalProfitLoss/10000?i.TotalProfitLoss/10000:minV
                    minV = minV>i.ActualProfitLoss/10000?i.ActualProfitLoss/10000:minV
                    $rootScope.nbAccounts.forEach(function (item) {
                      if(item.AccountId === i.AccountId){
                        i.AccountName = item.AccountName
                      }
                    })
                  })
                  $scope.summaryDataList = data
                  var minY = 0,
                    maxY = 0;
                  if(Math.abs(maxV)>Math.abs(minV)){
                    minY = -Math.abs(maxV)
                    maxY = Math.abs(maxV)
                  }else {
                    minY = -Math.abs(minV)
                    maxY = Math.abs(minV)
                  }
                  $scope.summaryOption.chart.yDomain = [minY.toFixed(4), maxY.toFixed(4)]
                  var list = []
                  list.push({
                    key: '账户总盈亏',
                    values: TotalProfitLossList,
                  })
                  list.push({
                    key: '实际总盈亏',
                    values: ActualProfitLossList,
                  })
                  $scope.summaryData = list
                })
            }

            //图表配置
            $scope.summaryOption = {
              chart: {
                type: 'lineChart',
                height: 450,
                margin : {
                  top: 20,
                  right: 50,
                  bottom: 50,
                  left: 75
                },
                x: function(d){
                  if(d && d.workday){
                    return d.workday;
                  }
                },
                y: function(d){
                  if(d && d.value){
                    return +d.value;
                  }
                },
                useInteractiveGuideline: true,
                xAxis: {
                  axisLabel: '日期',
                  tickFormat: function (d) {
                    return d3.time.format('%x')(new Date(d));
                  },
                },
                yAxis: {
                  axisLabel: '单位(万元)',/*
                         tickFormat: function (d) {
                         return d3.format('%')(d);
                         },*/
                  axisLabelDistance: 0
                }
              }
            };
            var summaryTimer = $timeout(function () {
              $scope.summaryData = []
            })
            //清除定时器
            $scope.$on(
              "$destroy",
              function( event ) {
                $timeout.cancel(summaryTimer);
              }
            );
          },
        }
      }])
})