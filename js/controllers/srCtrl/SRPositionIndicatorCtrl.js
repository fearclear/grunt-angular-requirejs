define(['app', 'storage'], function (app, storage) {
    return app.controller('SRPositionIndicatorCtrl',['$scope', '$rootScope', 'serverService', '$timeout', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $timeout, $cookies, $location) {
            $rootScope.pageNow = 'srPositionIndicator';
            $rootScope.statistical.pageNow = $rootScope.pageNow;
            $rootScope.isPagination = false;
            $rootScope.title = '统计报表';
            $rootScope.name = '持仓指标';
            $scope.sr = {};
            $scope.searchStats = function () {
                showLoading();
                serverService.getFindataStats($scope.sr.startDate, $scope.sr.endDate)
                    .then(function (data) {
                        hideLoading();
                        $scope.gridOptions.data = data;
                        data.forEach(function (i) {
                            /*if(i.maxDrawdown == 0){
                                i.maxDrawdown = '--';
                            }else{
                                i.maxDrawdown = i.maxDrawdown.toFixed(4)
                            }
                            if(i.maxDrawdownRate == 0){
                                i.maxDrawdownRate = '--';
                            }else{
                                i.maxDrawdownRate = i.maxDrawdownRate.toFixed(4)
                            }
                            if(i.dayDrawdownRate == 0){
                                i.dayDrawdownRate = '--';
                            }else{
                                i.dayDrawdownRate = i.dayDrawdownRate.toFixed(4)
                            }*/
                            i.maxDrawdownRate = (i.maxDrawdownRate*100).toFixed(4)
                            i.dayDrawdownRate = (i.dayDrawdownRate*100).toFixed(4)
                            i.yearYield = (i.yearYield*100).toFixed(4)
                            i.yearVolatility = (i.yearVolatility*100).toFixed(4)
                            i.startDate = new Date(i.startDate).Format('yyyy-MM-dd');
                            i.endDate = new Date(i.endDate).Format('yyyy-MM-dd');
                        })
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.gridOptions = {
                enableGridMenu: true,
                rowHeight: '42px',
                enableSelectAll: true,
                exporterMenuPdf: false, // ADD THIS
                exporterOlderExcelCompatibility: true,
                enableRowHeaderSelection: false,
                exporterCsvFilename: '持仓指标.csv',
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                columnDefs: [
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'fundName',displayName: '产品名称', cellClass: 'align_center'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'maxDrawdownRate',displayName: '最大回撤比率(%)',cellClass: 'number_type', type: 'string'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'dayDrawdownRate',displayName: '最大单日回撤比率(%)',cellClass: 'number_type', type: 'string'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'yearYield',displayName: '年化收益率(%)', cellFilter: 'number: 4',cellClass: 'number_type', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'sharpRatio',displayName: '夏普比率', cellFilter: 'number: 4',cellClass: 'number_type', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'fixSharpRatio',displayName: '夏普比率修正', cellFilter: 'number: 4',cellClass: 'number_type', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'sortinoRatio',displayName: '索提诺比率', cellFilter: 'number: 4',cellClass: 'number_type', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'fixSortinoRatio',displayName: '索提诺比率修正', cellFilter: 'number: 4',cellClass: 'number_type', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'drawdownDays',displayName: '回撤周期', cellFilter: 'number: 0',cellClass: 'align_center', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'drawdownBackDays',displayName: '回撤恢复周期', cellFilter: 'number: 0',cellClass: changeColor, type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'yearVolatility',displayName: '年化波动率(%)', cellFilter: 'number: 4',cellClass: 'number_type', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'yearYieldDrawdownRate',displayName: '收益回撤比', cellFilter: 'number: 4',cellClass: 'number_type', type: 'number'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'startDate',displayName: '最早净值时间',cellClass: 'number_type'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'endDate',displayName: '最新净值时间',cellClass: 'number_type'},
                ],
                onRegisterApi: function( gridApi ){
                    $scope.gridApi = gridApi;
                    gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                    });
                },
                enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
            };
            function changeColor(grid, row, col) {
                if(row.entity.backing){
                    return 'state_down align_center'
                }else{
                    return 'state_up align_center'
                }
            }
            $scope.compareStats = function () {
                $scope.gridOptions.data = $scope.gridApi.selection.getSelectedRows();
                $scope.gridApi.selection.clearSelectedRows();
            }
        }])
})