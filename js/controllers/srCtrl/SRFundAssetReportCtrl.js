define(['app'], function (app) {
  return app.controller('SRFundAssetReportCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $location) {
      $rootScope.pageNow = 'srFundAssetReport';
      $rootScope.statistical.pageNow = $rootScope.pageNow;
      $rootScope.isPagination = false;
      $rootScope.title = '统计报表';
      $rootScope.name = '基金资产统计表';
      $scope.columnDefs = [
        {enableColumnMenu: false, field: 'workday', displayName: '估值日期', cellClass: 'align_center'},
        {
          enableColumnMenu: false,
          field: 'fundNetMarketValue',
          displayName: '基金资产净值(市值)',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
        {
          enableColumnMenu: false,
          field: 'fundNetCost',
          displayName: '基金资产净值(成本)',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
        {
          enableColumnMenu: false,
          field: 'fundNetValue',
          displayName: '基金单位净值',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
        {
          enableColumnMenu: false,
          field: 'fundTotalNetValue',
          displayName: '基金累计单位净值',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
        {
          enableColumnMenu: false,
          field: 'cs',
          displayName: '中债估值单位净值',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
        {
          enableColumnMenu: false,
          field: 'shsz',
          displayName: '沪深300单位净值',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
        {
          enableColumnMenu: false,
          field: 'assetMarketValue',
          displayName: '资产类合计(市值)',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
        {
          enableColumnMenu: false,
          field: 'assetCost',
          displayName: '资产类合计(成本)',
          cellFilter: 'number: 4',
          cellClass: 'number_type',
          type: 'number'
        },
      ]
      $scope.searchMain = function (flag) {
        showLoading();
        if (flag) {
          $scope.columnDefs[0] = {
            enableColumnMenu: false,
            field: 'fundName',
            displayName: '产品名称',
            cellClass: 'align_center'
          };
          var params = {
            fundId: 0,
            workday: $scope.srFundDate,
          }
          serverService.getFindata(params)
            .then(function (data) {
              hideLoading();
              $scope.gridOptions.data = data;
            }, function (err) {
              $scope.$emit('rejectError', err)
            })
        } else {
          $scope.columnDefs[0] = {
            enableColumnMenu: false,
            field: 'workday',
            displayName: '估值日期',
            cellClass: 'align_center'
          };
          var params = {
            fundId: $scope.fundId,
            workday: '',
          }
          serverService.getFindata(params)
            .then(function (data) {
              hideLoading();
              $scope.gridOptions.data = data;
            }, function (err) {
              $scope.$emit('rejectError', err)
            })
        }
      }
      $scope.sel = {}
      $scope.getFundName = function () {
        var fund = $scope.sel.fund
        if (fund&&fund.fundId) {
          $scope.fundId = fund.fundId;
          $scope.gridOptions.exporterCsvFilename = '产品资产统计表(' + fund.fundName + ').csv';
          $scope.searchMain(false);
        }
        if ($scope.srFundDate) {
          $scope.searchMain(true);
        }
      }
      //比对功能
      $scope.getCompareData = function () {
        $scope.compareAllData = $scope.gridOptions.data.slice();
        $scope.gridOptions.data = $scope.gridApi.selection.getSelectedRows();
        $scope.gridApi.selection.clearSelectedRows();
      }
      $scope.getCompareAllData = function () {
        $scope.gridOptions.data = $scope.compareAllData.slice();
      }
      $scope.gridOptions = {
        enableGridMenu: true,
        rowHeight: '42px',
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        exporterOlderExcelCompatibility: true,
        enableRowHeaderSelection: false,
        exporterCsvFilename: '资产统计.csv',
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: $scope.columnDefs,
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;


          gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
          });
        },
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
    }])
})