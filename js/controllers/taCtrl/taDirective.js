/**
 * taDirective
 */
define(['app'], function (app) {
  return app
    .directive('taAccountSetting', ['serverService', '$rootScope', 'i18nService', 'uiGridConstants',
      function (serverService, $rootScope, i18nService, uiGridConstants) {
        return {
          restrict: 'AE',
          templateUrl: 'js/templates/taTemp/taAccountSetting.html',
          link: function ($scope, element, attr, ngModel) {
            $rootScope.title = '国债账户';
            $rootScope.name = '期货账户';
            // $rootScope.pageNow = 'taAccountSetting';
            $rootScope.pageIndex = 1;
            $scope.taForm = {};
            $rootScope.isPagination = false
            getNbfAccount();

            function getNbfAccount() {
              showLoading();
              serverService.getNbfAccount().then(function (data) {
                hideLoading();
                var count = 0
                data.forEach(function (i, n) {
                  i.index = ++count
                  i.stateName = i.State === 0 ? '正常' : '停用';
                  i.templateName = i.TemplateId === 1 ? 'A' : 'B';
                  i.TemplateId += '';
                })
                $scope.gridOptions2.data = data.filter(function (i, n) {
                  i.index = n
                  return i.AccountId !== 1
                });
                $rootScope.nbAccounts = data;
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
                  $scope.taForm = {
                    State: '0',
                    TemplateId: '1',
                    name: '新增期货账户',
                    confirm: '确认',
                  };
                  break;
                case 'edit':
                  $scope.isUpdate = true;
                  $scope.taForm.name = '期货账户修改';
                  $scope.taForm.confirm = '修改';
                  $scope.taForm.AccountName = update.AccountName;
                  $scope.taForm.CreateDate = new Date(update.CreateDate).Format('yyyy-MM-dd');
                  $scope.taForm.State = update.State;
                  $scope.taForm.TemplateId = update.TemplateId;
                  $scope.taForm.AccountNo = update.AccountNo;
                  $scope.taForm.AccountId = update.AccountId;
                  $scope.taForm.Cash = update.Cash;
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
                {
                  width: 50,
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  field: 'index',
                  displayName: '序号',
                  cellClass: 'align_center',
                  type: 'number'
                },
                {
                  width: '**',
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  field: 'AccountName',
                  displayName: '账户名',
                  cellClass: 'align_center'
                },
                {
                  width: '**',
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  field: 'CreateDate',
                  displayName: '创建时间',
                  cellClass: 'align_center',
                  cellFilter: 'date: "yyyy-MM-dd"'
                },
                {
                  width: '**',
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  field: 'stateName',
                  displayName: '状态',
                  cellClass: changeColor
                },
                {
                  width: '**',
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  field: 'templateName',
                  displayName: '模板类型',
                  cellClass: 'align_center'
                },
                {
                  width: '**',
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  field: 'AccountNo',
                  displayName: '账户号',
                  cellClass: 'align_center'
                },
                {
                  width: '**',
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  cellFilter: 'number',
                  field: 'Cash',
                  displayName: '期货本金(元)',
                  cellClass: 'number_type'
                },
                {
                  width: '**',
                  headerCellClass: 'align_center',
                  enableColumnMenu: false,
                  field: 'handle',
                  displayName: '操作',
                  cellClass: 'main_color align_center',
                  cellTemplate: '<div class="ui-grid-cell-contents main_color pointer"><span ng-click="grid.appScope.showEdit(\'edit\', row.entity)"><a href="javascript:;" class="main_color">修改</a></span><span style="margin-left: 10px" ng-click="grid.appScope.deleteNbfAccount(row.entity)"><a href="javascript:;" class="main_color">删除</a></span></div>'
                },
              ],
              onRegisterApi: function (gridApi) {
                $scope.gridApi = gridApi;
                gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
                  $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
                });
              },
              enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
            };

            function changeColor(grid, row) {
              if (row.entity.State === 0) {
                return 'align_center state_down';
              } else {
                return 'align_center state_up';
              }
            }

            //确认
            var isFirstClick = true;
            $scope.subEdit = function () {
              if (isFirstClick) {
                isFirstClick = false;
                $scope.tempList.AccountName = $scope.taForm.AccountName || '';
                $scope.tempList.CreateDate = $scope.taForm.CreateDate
                $scope.tempList.State = $scope.taForm.State;
                $scope.tempList.TemplateId = $scope.taForm.TemplateId || '';
                $scope.tempList.AccountNo = $scope.taForm.AccountNo || '';
                $scope.tempList.Cash = $scope.taForm.Cash || '';
                $scope.tempList.AccountId = $scope.taForm.AccountId || '';
                if ($scope.tempList.AccountId) {
                  serverService.updateNbfAccount($scope.tempList).then(function () {
                    $rootScope.errText = '修改成功';
                    $rootScope.isError = true;
                    $scope.taForm = {};
                    $scope.tempList = {};
                    $scope.isEdit = false;
                    getNbfAccount();
                    isFirstClick = true;
                  }, function (err) {
                    isFirstClick = true;
                    $scope.$emit('rejectError', err)
                  });
                } else {
                  serverService.createNBfAccount($scope.tempList).then(function () {
                    $rootScope.errText = '创建成功';
                    $rootScope.isError = true;
                    $scope.taForm = {};
                    $scope.tempList = {};
                    $scope.isEdit = false;
                    getNbfAccount();
                    isFirstClick = true;
                  }, function (err) {
                    isFirstClick = true;
                    $scope.$emit('rejectError', err)
                  });
                }
              }
            };
            //取消
            $scope.cancelEdit = function () {
              $scope.isEdit = false;
              $scope.fmFund = {};
              $scope.tempList = {};
            };
            //删除交易对手
            $scope.deleteNbfAccount = function (item) {
              $scope.$emit('chooseResult', {
                str: '确定删除该账户吗？',
                cb: function () {
                  serverService.deleteNbfAccount(item.AccountId).then(function () {
                    $rootScope.errText = '删除成功';
                    $rootScope.isError = true;
                    getNbfAccount();
                  }, function (err) {
                    $scope.$emit('rejectError', err)
                  });
                }
              })
            };
            //参数
            $scope.params = {
              template: [
                {
                  id: '1',
                  value: 'A',
                },
                {
                  id: '2',
                  value: 'B',
                },
              ]
            }
            //事件通信
            $scope.$on("tmTraderCounterparty", function (event, data) {
              // 这里取到发送过来的数据 data
              getNbfAccount();
            });
          },
        }
      }])
    .directive('taSpotSummaries', ['serverService', '$rootScope', '$timeout', 'i18nService', 'uiGridConstants',
      function (serverService, $rootScope, $timeout, i18nService, uiGridConstants) {
        return {
          restrict: 'AE',
          templateUrl: 'js/templates/taTemp/taSpotSummaries.html',
          link: function ($scope, element, attr, ngModel) {
            $rootScope.title = '国债账户';
            $rootScope.name = '期货账户';
            $rootScope.pageIndex = 1;
            $rootScope.isPagination = false
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
              startDate: startDate,
              endDate: endDate,
            }
            $scope.getNbSummaries = function(params) {
              var params = {
                startDate: params&&params.startDate?params.startDate:$scope.searchForm.startDate,
                endDate: params&&params.endDate?params.endDate:$scope.searchForm.endDate,
              }
              showLoading()
              serverService.getNbSummaries(params)
                .then(function (data) {
                  hideLoading()
                  var totalProfitList = []
                  var actualProfitList = []
                  var maxV = 0,
                    minV = 0;
                  data.forEach(function (i) {
                    totalProfitList.push({
                      workday: i.workday,
                      value: (+i.totalProfit/10000).toFixed(4),
                    })
                    actualProfitList.push({
                      workday: i.workday,
                      value: (+i.actualProfit/10000).toFixed(4),
                    })
                    maxV = maxV<i.totalProfit/10000?i.totalProfit/10000:maxV
                    maxV = maxV<i.actualProfit/10000?i.actualProfit/10000:maxV
                    minV = minV>i.totalProfit/10000?i.totalProfit/10000:minV
                    minV = minV>i.actualProfit/10000?i.actualProfit/10000:minV
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
                    key: '实际盈亏',
                    values: actualProfitList,
                  })
                  list.push({
                    key: '总盈亏',
                    values: totalProfitList,
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
                  axisLabelDistance: 0,
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