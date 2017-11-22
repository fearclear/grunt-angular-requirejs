define(['app', 'storage', 'echarts'], function (app, storage, echarts) {
  return app.controller('SignalQueryCtrl', ['$scope', '$rootScope', 'serverService', '$location', '$timeout', 'baseService',
    function ($scope, $rootScope, serverService, $location, $timeout) {
      $rootScope.pageNow = 'signalQuery';
      $rootScope.title = '信号查询';
      $scope.gridOptions = {
        enableGridMenu: false,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        rowHeight: '36',
        exporterOlderExcelCompatibility: true,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [{
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
            field: 'createTime',
            displayName: '日期/时间',
            cellClass: 'align_center',
            cellFilter: 'date: "yyyy-MM-dd"'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'instrumentCode',
            displayName: '合约号',
            cellClass: 'align_center',
            cellTemplate: '<div class="ui-grid-cell-contents" ><span class="pointer main_color" ng-click="grid.appScope.showKChart(row.entity)">{{grid.getCellValue(row, col)}}</span></div>'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'signal',
            displayName: '信号',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'positionId',
            displayName: '头寸编号',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'positionPrice',
            displayName: '头寸单价',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'curPrice',
            displayName: '当前价格',
            cellClass: 'number_type',
            cellFilter: 'number'
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

      getSingnal()
      function getSingnal() {
        serverService.getSingnal()
          .then(function (data) {
            data.forEach(function (i, n) {
              i.index = n+1;
            })
            $scope.gridOptions.data = data;
          })
      }
      //重置mychart大小
      window.onresize = function () {
        if(myChart){
          myChart.resize()
        }
      }
    }]);
});