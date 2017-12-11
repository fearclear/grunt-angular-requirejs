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
            field: 'instrumentId',
            displayName: '合约号',
            cellClass: 'align_center',
            cellTemplate: '<div class="ui-grid-cell-contents" ><span class="pointer main_color" ng-click="grid.appScope.showKChart(row.entity)">{{grid.getCellValue(row, col)}}</span></div>'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'directionType',
            displayName: '方向',
            cellClass: changeColor,
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
            field: 'cost',
            displayName: '成本',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center color-red',
            enableColumnMenu: false,
            field: 'lastPrice',
            displayName: '当前价格?',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: '**',
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'lastMarket',
            displayName: '市值',
            cellClass: 'number_type',
            cellFilter: 'number'
          },
          {
            width: 100,
            headerCellClass: 'align_center bold',
            enableColumnMenu: false,
            field: 'handle',
            displayName: '操作',
            cellClass: 'align_center',
            cellTemplate: '<div class="ui-grid-cell-contents"><span class="main_color pointer" ng-click="grid.appScope.showDetail(row.entity)">查看</span></div>'
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

      //获取持仓信息
      getHolding();
      function getHolding(params) {
        params = params ? params : {};
        showLoading()
        serverService.getHolding(params)
          .then(function (data) {
            console.log(data)
            if(data && data.length){
              data.forEach(function (i, n) {
                i.index = n+1;
                i.directionType = i.direction === 0 ? '空' : i.direction === 1 ? '多' : ''
              });
              $scope.gridOptions.data = data;
            }
          })
      }

      //获取本金
      $scope.moneyType = {}
      getMoney()
      function getMoney() {
        var workday = new Date().Format('yyyy-MM-dd');
        showLoading()
        serverService.getMoney({workday: workday})
          .then(function (data) {
            $scope.moneyType = data
          })
      }
      
      //查看详情
      $scope.showDetail = function (item) {
        item.instrument_id = item.instrumentId;
        serverService.getPosition(item)
          .then(function (data) {
            console.log(data);
            data.forEach(function (i) {
              i.directionType = i.direction === 0 ? '空' : '多';
            });
            $scope.isShowMoreList = true;
            $scope.detailList = data;
          })
      }

      $scope.cancelShowMore = function () {
        $scope.isShowMoreList = false
        $scope.detailList = []
      }
    }]);
});