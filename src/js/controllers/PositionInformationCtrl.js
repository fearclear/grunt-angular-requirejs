define(['app', 'storage'], function (app, storage) {
  return app.controller('PositionInformationCtrl', ['$scope', '$rootScope', 'serverService', '$location', '$timeout', 'baseService',
    function ($scope, $rootScope, serverService, $location, $timeout) {
      $rootScope.pageNow = 'positionInformation';
      $rootScope.title = '持仓信息'
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
            field: 'operatorName',
            displayName: '合约号',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'businessType',
            displayName: '方向',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'applicationShow',
            displayName: '数量',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'stateShow',
            displayName: '成本',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center color-red',
            enableColumnMenu: false,
            field: 'createTimeShow',
            displayName: '当前价格?',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'createTimeShow',
            displayName: '市值',
            cellClass: 'align_center',
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

      //获取持仓信息
      getPosition();
      function getPosition(params) {
        params = params ? params : {};
        serverService.getPosition(params)
          .then(function (data) {
            console.log(data)
          })
      }
    }]);
});