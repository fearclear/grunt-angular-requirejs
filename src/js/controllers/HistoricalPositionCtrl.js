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
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'operatorName',
            displayName: '姓名',
            cellClass: 'align_center'
          },
          {
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'businessType',
            displayName: '流程类型',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'applicationShow',
            displayName: '流程时间',
            cellClass: 'align_center'
          },
          {
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'stateShow',
            displayName: '审批状态',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'createTimeShow',
            displayName: '发起时间',
            cellClass: 'align_center',
            cellFilter: 'date: yyyy-MM-dd'
          },
          {
            width: 100,
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'handle',
            displayName: '操作',
            cellClass: 'main_color align_center',
            cellTemplate: '<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.showDetail(row.entity.tabIndex, row.entity)"><span><a href="javascript:;" class="main_color">{{row.entity.handleText}}</a></span></div>'
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
    }]);
});