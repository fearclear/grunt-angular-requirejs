define(['app', 'storage'], function (app, storage) {
  return app.controller('TATreasuryFuturesCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$q', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $timeout, $q) {
      $rootScope.pageNow = 'taTreasuryFutures';
      $rootScope.pageIndex = 1;
      $rootScope.isPagination = false;
      $rootScope.title = '国债账户';
      $rootScope.name = '期货账户';
      $scope.isMain = true;
      $scope.headInfo = {};
      $scope.refreshTab = function (flag) {
        $scope.tabNow = flag;
        $scope.isMain = !flag;
        if(flag<900){
          showLoading();
          serverService.getNbfSummary(flag)
            .then(function (data) {
              hideLoading();
              $scope.headInfo = data.Summary;
              $scope.gridOptions.data = [];
              if(data.HoldingList){
                data.HoldingList.forEach(function (i) {
                  i.typeShow = i.Direction||'' + i.Type||''
                })
              }
              $scope.gridOptions.data = data.HoldingList;
            }, function (err) {
              $scope.$emit('rejectError', err);
            })
        }else if(flag===998){
          $scope.getNbfSummaries()
        }
      }
      $scope.refreshTab(0);
      $scope.tabs = [
        {
          AccountId: 0,
          AccountName: '账户合计',
        },
      ]
      getNbAccount()
      function getNbAccount() {
        $timeout(function () {
          if($rootScope.nbAccounts){
            $scope.tabs = $scope.tabs.concat($rootScope.nbAccounts);
            $scope.tabs.push({
                AccountId: 998,
                AccountName: '盈亏走势图',
              })
            $scope.tabs.push({
                AccountId: 999,
                AccountName: '期货账户配置',
              })
          }else {
            getNbAccount();
          }
        }, 200)
      }
      $scope.gridOptions = {
        enableGridMenu: true,
        rowHeight: '42px',
        rowEditWaitInterval: 200,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        exporterCsvFilename: '国债期货.csv',
        exporterOlderExcelCompatibility: true,
        enableRowHeaderSelection: false,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'TradeTarget',displayName: '合约号', cellClass: 'align_center'},
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'typeShow',displayName: '多空', cellClass: changeAmountColor.bind(this, 'align_center')},
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'Amount',displayName: '数量',cellClass: changeAmountColor.bind(this, 'number_type'), cellFilter: 'number: 0'  },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'Cost',displayName: '成本',cellClass: 'number_type', cellFilter: 'number: 4'  },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'MarketValue',displayName: '市值',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'ClearPrice',displayName: '收盘价格',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'ClearDate',displayName: '操作日期',cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd HH:mm:ss"'  },
        ],
        onRegisterApi: function( gridApi ){
          $scope.gridApi = gridApi;
        },
        enablePaginationControls: false,
        enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      function changeAmountColor(str, grid, row) {
        if(row.entity.Amount >= 0){
          return str+' state_up';
        }else {
          return str+' state_down';
        }
      }
      function changeColor(grid, row, col) {
        if(row.entity.ProfitLoss >=0){
          return 'number_type state_up'
        }else {
          return 'number_type state_down'
        }
      }
    }])
})