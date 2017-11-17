define(['app', 'storage'], function (app, storage) {
    return app.controller('SRPositionChangeCtrl',['$scope', '$rootScope', 'serverService', '$timeout', '$cookies', '$location', 'baseService',
        function ($scope, $rootScope, serverService, $timeout, $cookies, $location) {
            $rootScope.pageNow = 'srPositionChange';
            $rootScope.statistical.pageNow = $rootScope.pageNow;
            $rootScope.isPagination = false;
            $rootScope.title = '统计报表';
            $rootScope.name = '持仓变化';
            $scope.sr = {};

            $scope.gridOptions = {
                enableGridMenu: true,
                rowHeight: '42px',
                enableSelectAll: true,
                exporterMenuPdf: false, // ADD THIS
                exporterOlderExcelCompatibility: true,
                enableRowHeaderSelection: false,
                exporterCsvFilename: '持仓变化.csv',
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                columnDefs: [
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'productName',displayName: '债券简称', cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goBondDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'companyName',displayName: '主体名称',cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.goMainDetail(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'productNumberBase', cellFilter: 'number: 0',displayName: '上期持仓',cellClass: 'align_center',},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'productNumberOther', cellFilter: 'number: 0',displayName: '本期持仓', cellClass: 'align_center',},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'dueDate',displayName: '到期日', cellClass: 'align_center',},
                    { enableColumnMenu: false, headerCellClass: 'align_center', field: 'productNumberChange',displayName: '持仓变化', cellClass: markColor,},
                ],
                onRegisterApi: function( gridApi ){
                    $scope.gridApi = gridApi;
                    gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                    });
                },
                enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
            };
            if(storage.session.getItem(storage.KEY.STATISTICAL.KEY)){
                $timeout(function () {
                    $scope.sr.baseDate = storage.session.getItem(storage.KEY.STATISTICAL.BASEDATE);
                    $scope.sr.otherDate = storage.session.getItem(storage.KEY.STATISTICAL.OTHERDATE);
                })
                $scope.gridOptions.data = storage.session.getItem(storage.KEY.STATISTICAL.DATA);
            }
            $scope.searchMain = function (params) {
                params = params?params:{}
                params = {
                    baseDate: params.baseDate||$scope.sr.baseDate,
                    otherDate: params.otherDate||$scope.sr.otherDate,
                }
                showLoading();
                serverService.getClaireHoldingChange(params)
                    .then(function (data) {
                        hideLoading();
                        data.forEach(function (i) {
                            if(i.productNumberChange >= 0){
                                i.productNumberChange = '+' + i.productNumberChange
                            }
                        })
                        $scope.gridOptions.data = data;
                        storage.session.setItem(storage.KEY.STATISTICAL.KEY, true);
                        storage.session.setItem(storage.KEY.STATISTICAL.DATA, data);
                        storage.session.setItem(storage.KEY.STATISTICAL.BASEDATE, $scope.sr.baseDate);
                        storage.session.setItem(storage.KEY.STATISTICAL.OTHERDATE, $scope.sr.otherDate);
                    }, function (err) {
                        hideLoading();
                        if(err && err.text){
                            $rootScope.isError = true;
                            $rootScope.errText = err.text.replace('基准日期', '上期持仓').replace('对比日期', '本期持仓');
                        }
                    })
            }
            $scope.compareDate = function () {
                if($scope.sr.baseDate && $scope.sr.otherDate){
                    var start = new Date($scope.sr.baseDate.replace(/-/g,'/')).getTime();
                    var end = new Date($scope.sr.otherDate.replace(/-/g,'/')).getTime();
                    if(start>end){
                        $rootScope.errText = '本期持仓日期不能大于上期持仓日期';
                        $rootScope.isError = true;
                        $scope.sr = {};
                    }
                }
            }
            //查看主体详情
            $scope.goMainDetail = function (item) {
                var flag = true;
                $rootScope.tabLists.forEach(function (i) {
                    if(i.id == item.companyEID){
                        $rootScope.tabItemId = item.companyEID;
                        flag = false;
                    }
                })
                if(flag){
                    if($rootScope.tabLists.length>=9){
                        $rootScope.tabLists.shift();
                    }
                    $rootScope.tabLists.push({
                        id: item.companyEID,
                        name: item.companyName,
                        type: 'company'
                    })
                }
                // var companyList = [];
                // $rootScope.tabLists.forEach(function (i) {
                //     companyList.push(i.id);
                // })
                // storage.session.setItem(storage.KEY.COMPANYLIST, companyList);
                $location.path('/creditManagement').replace();
                $rootScope.tabItemId = item.companyEID;
                $rootScope.isBondContentDetail = true;
            }
            //查看债项详情
            $scope.goBondDetail = function (item) {
                var flag = true;
                $rootScope.tabLists.forEach(function (i) {
                    if(i.id == item.productEID){
                        $rootScope.tabItemId = item.productEID;
                        flag = false;
                    }
                })
                if(flag){
                    if($rootScope.tabLists.length>=9){
                        $rootScope.tabLists.shift();
                    }
                    $rootScope.tabLists.push({
                        id: item.productEID,
                        name: item.productName,
                        type: 'product'
                    })
                }
                // var companyList = [];
                // $rootScope.tabLists.forEach(function (i) {
                //     companyList.push(i.id);
                // })
                // storage.session.setItem(storage.KEY.COMPANYLIST, companyList);
                $location.path('/creditManagement').replace();
                $rootScope.tabItemId = item.productEID;
                $rootScope.isBondContentDetail = true;
            }

            function markColor(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row,col) >=0) {
                    return 'number_type state_up';
                }else {
                    return 'number_type state_down';
                }
            }
        }])
})