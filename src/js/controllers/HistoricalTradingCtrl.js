define(['app', 'storage'], function (app, storage) {
  return app.controller('HistoricalTradingCtrl', ['$scope', '$rootScope', 'serverService', '$location', '$timeout', 'baseService',
    function ($scope, $rootScope, serverService, $location, $timeout) {
      $rootScope.pageNow = 'historicalTrading';
      $rootScope.title = '历史交易';
      $scope.gridOptions = {
        enableGridMenu: false,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        rowHeight: '36',
        exporterOlderExcelCompatibility: true,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          {
            width: 50,
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'index',
            displayName: '序号',
            cellClass: 'align_center',
            type: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'valueDate',
            displayName: '日期',
            cellClass: 'align_center',
            cellFilter: 'date: "yyyy-MM-dd"'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'volume',
            displayName: '数量',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'directionType',
            displayName: '方向',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'tradeTypeShow',
            displayName: '交易类型',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'tradePrice',
            displayName: '价格',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'amount',
            displayName: '交易总价',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'poundage',
            displayName: '手续费',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'poundageType',
            displayName: '手续费类型',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'createTime',
            displayName: '具体交易时间',
            cellClass: 'align_center',
            cellFilter: 'date: "yyyy-MM-dd"'
          },
        ],
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = {
              name: changedColumn.colDef.name,
              visible: changedColumn.colDef.visible
            };
          });
        },
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
        // enableVerticalScrollbar: 0,
      };

      getTrade()
      function getTrade() {
        serverService.getTrade()
          .then(function (data) {
            data.forEach(function (i, n) {
              i.index = n+1;
              i.directionType = i.direction === 1 ? '开仓' : '平仓'
              var tradeTypeShow = '买开'
              switch (i.tradeType){
                case 1: 
                  tradeTypeShow = '买开'
                  break
                case 2:
                  tradeTypeShow = '卖平'
                  break
                case 3:
                  tradeTypeShow = '卖开'
                  break
                case 4:
                  tradeTypeShow = '买平'
                  break
                case 5:
                  tradeTypeShow = '平今'
                  break
              }
              i.tradeTypeShow = tradeTypeShow
            })
            $scope.gridOptions.data = data;
          })
      }
    }]);
});