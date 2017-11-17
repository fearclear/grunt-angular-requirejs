define(['app'], function (app) {
  return app.controller('CMWarningCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$location', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $timeout, $location) {
      $rootScope.title = '信用管理';
      $rootScope.pageNow = 'cmWarning';
      $rootScope.pageIndex = 1;
      $rootScope.isPagination = false;
      getRecordCompanyWarning()
      function getRecordCompanyWarning() {
        showLoading();
        serverService.getRecordCompanyWarning()
          .then(function (data) {
            data.sort(function (a, b) {
              var prev = new Date(a.RATINGDATE.replace(/-/g, '/')).getTime()
              var next = new Date(b.RATINGDATE.replace(/-/g, '/')).getTime()
              if(prev>next){
                return -1
              }else {
                return 1
              }
            })
            var count = 0
            data.forEach(function (i, n) {
              i.index = n+1
              if(new Date().getTime()-new Date(i.RATINGDATE.replace(/-/g, '/')).getTime()<7*24*60*60*1000){
                i.isTop = true
                count++
              }
            })
            if(count<=5){
              data.slice(0, 5).forEach(function (i) {
                i.isTop = true
              })
            }
            $scope.gridOptions.data = data;
          })
      }
      $scope.gridOptions = {
        enableGridMenu: false,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        rowHeight: '36',
        exporterOlderExcelCompatibility: true,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [{
          width: '100',
          headerCellClass: 'align_center',
          enableColumnMenu: false,
          field: 'index',
          displayName: '序号',
          cellClass: 'align_center',
          type: 'number',
        },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'companyName',
            displayName: '主体名称',
            cellClass: 'align_center pointer',
            cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'RATINGDATE',
            displayName: '发布时间',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'companyOutGrade',
            displayName: '信用评级',
            cellClass: 'align_center',
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'RATETYPE',
            displayName: '评级类型',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'RATEFWD',
            displayName: '评级展望',
            cellClass: 'align_center'
          },
          {
            width: '**',
            headerCellClass: 'align_center',
            enableColumnMenu: false,
            field: 'CREDITNAME',
            displayName: '评级机构',
            cellClass: 'align_center'
          },
        ],
        rowTemplate: "<div ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader, 'state_up':row.entity.isTop }\" ui-grid-cell></div>",
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
      };
      //查看主体详情
      $scope.goMainDetail = function (item) {
        var flag = true;
        $rootScope.tabLists.forEach(function (i) {
          if(i.id == item.EID){
            $rootScope.tabItemId = item.EID;
            flag = false;
          }
        })
        if(flag){
          if($rootScope.tabLists.length>=9){
            $rootScope.tabLists.shift();
          }
          $rootScope.tabLists.push({
            id: item.EID,
            name: item.companyName,
            type: 'company'
          })
        }
        $location.path('/creditManagement').replace();
        $rootScope.tabItemId = item.EID;
        $rootScope.isBondContentDetail = true;
      }
      //事件通信
    }])
})