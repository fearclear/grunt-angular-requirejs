define(['app', 'storage'], function (app, storage) {
  return app.controller('HistoricalPositionCtrl', ['$scope', '$rootScope', 'serverService', '$location', '$timeout', 'baseService',
    function ($scope, $rootScope, serverService, $location, $timeout) {
      $rootScope.pageNow = 'historicalPosition';
      $rootScope.title = '历史头寸单价';
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
            field: 'instrumentCode',
            displayName: '合约号',
            cellClass: 'align_center',
            cellTemplate: '<div class="ui-grid-cell-contents" ><span class="pointer main_color" ng-click="grid.appScope.showKChart(row.entity)">{{grid.getCellValue(row, col)}}</span></div>'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'positionId',
            displayName: '头寸编号',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'directionType',
            displayName: '方向',
            cellClass: changeColor,
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'count',
            displayName: '数量',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'createTime',
            displayName: '建仓时间',
            cellClass: 'number_type',
            cellFilter: 'date: "yyyy-MM-dd"'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'cost',
            displayName: '成本',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'evenTime',
            displayName: '平仓时间',
            cellClass: 'number_type',
            cellFilter: 'date: "yyyy-MM-dd"'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'evenPrice',
            displayName: '平仓价格',
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
      //多空标色
      function changeColor(grid, row, col) {
        if(row.entity.direction){
          return 'align_center color-red'
        }else {
          return 'align_center color-green'
        }
      }

      getPosition()
      function getPosition() {
        serverService.getPosition()
          .then(function (data) {
            console.log(data)
            data.forEach(function (i, n) {
              i.index = n+1;
              i.directionType = i.direction === 0 ? '空' : '多';
            })
            $scope.gridOptions.data = data
          })
      }
    }]);
});