define(['app', 'storage'], function (app, storage) {
  return app.controller('TATreasurySpotCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$interval', '$q', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $interval, $q) {
      $rootScope.pageNow = 'taTreasurySpot';
      $rootScope.pageIndex = 1;
      $rootScope.isPagination = false;
      $rootScope.title = '国债账户';
      $rootScope.name = '现货账户';
      $scope.filNum = 2;
      $scope.headInfo = {
        priceShow: '中债估值',
        modiPriceShow: '修正估值',
      };
      $scope.tabs = [
        {
          key: 0,
          value: '账户合计',
        },
        {
          key: 1,
          value: '盈亏走势图',
        }
      ]
      $scope.refreshTab = function (flag) {
        $scope.tabNow = flag;
        if(flag === 0){
          getNbSummary()
        }else if(flag === 1){
          $scope.getNbSummaries()
        }
      }
      $scope.refreshTab(0)
      function getNbSummary() {
        showLoading();
        serverService.getNbSummary()
          .then(function (data) {
            hideLoading();
            $scope.headInfo = data;
            if(data.items){
              data.items.forEach(function (i) {
                i.marketValue = i.modiPrice * i.volume;
              })
            }
            $scope.headInfo.priceShow = '中债估值/'+new Date(+data.cnbdDate).Format('yyyy-MM-dd');
            $scope.headInfo.modiPriceShow = '修正估值/'+new Date(+data.workday).Format('yyyy-MM-dd');
            $scope.gridOptions.data = data.items;
            $scope.gridOptions.columnDefs = [
              { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'securityName',displayName: '债券名称', cellClass: 'align_center'},
              { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'windcode',displayName: '券码', cellClass: 'align_center'},
              { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'volume',displayName: '数量',cellClass: 'number_type', cellFilter: 'number: 0'  },
              { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'cost',displayName: '成本',cellClass: 'number_type', cellFilter: 'number: 4'  },
              { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'marketValue',displayName: '市值',cellClass: 'number_type', cellFilter: 'number: 4' },
              { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'floatingProfit',displayName: '浮动盈亏',cellClass: changeColor, cellFilter: 'number: 4'  },
              { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'price',displayName: $scope.headInfo.priceShow,cellClass: 'number_type', cellFilter: 'number: 4' },
              { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'modiPrice',displayName: $scope.headInfo.modiPriceShow,cellClass: 'number_type', type: 'number',cellFilter: 'number: 4' },
              { width: 100, enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'handle',displayName: '操作', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer align_center"><span><a href="javascript:;" class="main_color" ng-click="grid.appScope.update(row.entity)">修正估值</a></span></div>'},
            ];
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      $scope.gridOptions = {
        enableGridMenu: true,
        rowHeight: '42px',
        rowEditWaitInterval: 200,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        exporterCsvFilename: '国债现货.csv',
        exporterOlderExcelCompatibility: true,
        enableRowHeaderSelection: false,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'securityName',displayName: '债券名称', cellClass: 'align_center'},
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'windcode',displayName: '券码', cellClass: 'align_center'},
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'volume',displayName: '数量',cellClass: 'number_type', cellFilter: 'number: 0'  },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'cost',displayName: '成本',cellClass: 'number_type', cellFilter: 'number: 4'  },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'marketValue',displayName: '市值',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'floatingProfit',displayName: '浮动盈亏',cellClass: changeColor, cellFilter: 'number: 4'  },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'price',displayName: $scope.headInfo.priceShow,cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'modiPrice',displayName: $scope.headInfo.modiPriceShow,cellClass: 'number_type', type: 'number',cellFilter: 'number: 4' },
          { width: 100, enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'handle',displayName: '操作', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer align_center"><span><a href="javascript:;" class="main_color" ng-click="grid.appScope.update(row.entity)">修正估值</a></span></div>'},
        ],
        onRegisterApi: function( gridApi ){
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
            $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
          });
          gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        },
        enablePaginationControls: false,
        enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      function changeColor(grid, row, col) {
        if(row.entity.floatingProfit >=0){
          return 'number_type state_up'
        }else {
          return 'number_type state_down'
        }
      }
      $scope.saveRow = function (rowEntity) {
        var promise = $q.defer();
        $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
        $interval(function () {
          promise.reject()
        }, 200)
      }
      $scope.update = function (rowEntity) {
        var tempRow = [];
        serverService.updateNbModiPrice(rowEntity)
          .then(function () {
            tempRow.push(rowEntity);
            $scope.gridApi.rowEdit.setRowsClean(tempRow)
            getNbSummary()
          })
      }
    }])
})