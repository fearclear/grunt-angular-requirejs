define(['app'], function (app) {
    return app.controller('RMStaticCheckCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location) {
            $rootScope.pageNow = 'rmStaticCheck';
            $rootScope.isPagination = false;
            $rootScope.title = '风险管理';
            $rootScope.name = '静态检查';
            $scope.gridOptions = {
                enableGridMenu: false,
                rowHeight: '42px',
                enableSelectAll: true,
                exporterMenuPdf: false, // ADD THIS
                exporterOlderExcelCompatibility: true,
                enableRowHeaderSelection: false,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                columnDefs: [
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'index',displayName: '序号', cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goBondDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'companyName',displayName: '产品',cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'rules1',displayName: '规则01',cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'rules2',displayName: '规则02',cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'rules3',displayName: '规则03',cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'rules4',displayName: '规则04',cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'rules5',displayName: '规则05',cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                ],
                onRegisterApi: function( gridApi ){
                    $scope.gridApi = gridApi;
                    gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                    });
                },
                enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
            };
        }])
})