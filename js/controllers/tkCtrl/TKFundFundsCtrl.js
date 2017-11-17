define(['app', 'storage'], function (app, storage) {
    return app.controller('TKFundFundsCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$location', '$interval', 'i18nService', 'uiGridConstants', 'baseService',
        function ($scope, $rootScope, serverService, $cookies, $location, $interval, i18nService, uiGridConstants) {
            $rootScope.pageNow = 'TKFundFunds';
            $rootScope.title = '交易看板';
            $rootScope.name = '产品资金动态';
            $rootScope.pageIndex = '1';
            $rootScope.isPagination = false
            $scope.key = {};
            i18nService.setCurrentLang("zh-cn");
            getFundFunds(0, 1, 10000);
            function getFundFunds(fundId, pageIndex, pageSize) {
                $rootScope.pageIndex = pageIndex;
                showLoading();
                serverService.getMoneyAvailable(fundId, pageIndex, pageSize)
                    .then(function (data) {
                        hideLoading();
                        if(data.list.length){
                            for(var t in data.list[0]){
                                $scope.key[t+'Key'] = false;
                                $scope.key[t+'Flag'] = true;
                            }
                        }
                        $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                        data.list.forEach(function (i) {
                            i.available = +i.available/10000;
                            i.buyMoney = +i.buyMoney/10000;
                            i.buyNewBond = +i.buyNewBond/10000;
                            i.buyoutReverseRepo = +i.buyoutReverseRepo/10000;
                            i.buyoutSellRepo = +i.buyoutSellRepo/10000;
                            i.cash = +i.cash/10000;
                            i.reverseRepo = +i.reverseRepo/10000;
                            i.sellMoney = +i.sellMoney/10000;
                            i.sellRepo = +i.sellRepo/10000;
                            i.sellRepoDebt = +i.sellRepoDebt/10000;
                            i.t0Buy = +i.t0Buy/10000;
                            i.t0Receivable = +i.t0Receivable/10000;
                            i.t0Sell = +i.t0Sell/10000;
                            i.t1BuyDebt = +i.t1BuyDebt/10000;
                            i.t1Debt = +i.t1Debt/10000;
                            i.t1Receivable = +i.t1Receivable/10000;
                            i.paymentMoney = +i.paymentMoney/10000;
                            i.standardSecuritySHAvailable = +i.standardSecuritySHAvailable/10000;
                            i.standardSecuritySZAvailable = +i.standardSecuritySZAvailable/10000;
                            i.leveraging = +i.leveraging;
                            i.assetMarketValue = +i.assetMarketValue/10000;
                            i.fundNetMarketValue = +i.fundNetMarketValue/10000;
                            i.repoAsset = +i.repoAsset/10000;
                            i.bondSettlement = +i.bondSettlement/10000;
                            for(var j in i){
                                if(i[j]) {
                                    $scope.key[j + 'Flag'] = false;
                                }
                            }
                        })
                        changeVisible($scope.key, data.list);
                        if(!$scope.computeDay){
                            serverService.getWorkDay(new Date().Format('yyyy-MM-dd'), -1)
                                .then(function (data) {
                                    var tempArr = data.workday.split('-');
                                    $scope.computeDay = tempArr[1]+'-'+tempArr[2];
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                });
                        }
                        $scope.gridOptions.data = data.list;
                        var t = 0;
                        data.list.forEach(function (i) {
                            i.index = ++t;
                            if(i.leveragingDate){
                                i.leveragingDate = ' | '+new Date(i.leveragingDate).Format('MM-dd');
                            }
                        })
                        if(data.list && data.list.length){
                            $scope.tkTicketTime = new Date(data.list[0].workday).Format('yyyy-MM-dd');
                        }
                        $rootScope.pageTotal = Math.ceil(data.count / 10000);
                        $rootScope.totalCount = data.count;
                    }, function (err) {
                        hideLoading()
                        $scope.$emit('rejectError', err)
                    });
            }
            function changeVisible(arr, list){
                list.forEach(function (j) {
                    for(var i in j){
                        if(arr[i+'Flag']){
                            var pos = $scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf(i);
                            if(i!='index' && i!='fundName' && i!='available' && i!='leveraging' && $scope.gridOptions.columnDefs[pos]){
                                $scope.gridOptions.columnDefs[pos].visible = false;
                            }
                        }
                    }
                })
            }
            $scope.gridOptions = {
                enableGridMenu: true,
                enableSelectAll: true,
                exporterMenuPdf: false, // ADD THIS
                rowHeight: '42',
                exporterCsvFilename: '产品资金动态表.csv',
                exporterOlderExcelCompatibility: true,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                columnDefs: [
                    { width: 50, enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
                    { enableColumnMenu: false, field: 'fundName',displayName: '产品名称', cellClass: 'main_color pointer',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.showMore(row.entity)">{{grid.getCellValue(row, col)}}</div>' },
                    { enableColumnMenu: false, field: 'available',displayName: '头寸' ,cellFilter: 'number: 4', cellClass: changeStateColor, type: 'number'},
                    { enableColumnMenu: false, field: 'cash',displayName: '现金' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'repoAsset',displayName: '买入返售金额资产' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'bondSettlement',displayName: '证券清算款' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'buyMoney',displayName: '申购' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'sellMoney',displayName: '赎回'  ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 't0Sell',displayName: 'T0卖券'  ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'sellRepo',displayName: '正回购借入' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'buyoutSellRepo',displayName: '买断式借入' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'buyNewBond',displayName: '新债' ,cellFilter: 'number: 4', cellClass: stateDownBold, type: 'number' },
                    { enableColumnMenu: false, field: 't0Buy',displayName: 'T0买券支出' ,cellFilter: 'number: 4', cellClass: stateDownBold, type: 'number' },
                    { enableColumnMenu: false, field: 'reverseRepo',displayName: '逆回购支出' ,cellFilter: 'number: 4', cellClass: stateDownBold, type: 'number'},
                    { enableColumnMenu: false, field: 'buyoutReverseRepo',displayName: '买断支出' ,cellFilter: 'number: 4', cellClass: stateDownBold, type: 'number'},
                    { enableColumnMenu: false, field: 'sellRepoDebt',displayName: '正回购到期负债' ,cellFilter: 'number: 4', cellClass: stateDownBold, type: 'number'},
                    { enableColumnMenu: false, field: 't1BuyDebt',displayName: '昨日买券负债' ,cellFilter: 'number: 4', cellClass: stateDownBold, type: 'number'},
                    { enableColumnMenu: false, field: 'paymentMoney',displayName: '兑付' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 't0Receivable',displayName: 'T0应收' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 't1Receivable',displayName: 'T1应收' ,cellFilter: 'number: 4', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 't1Debt',displayName: 'T1应付' ,cellFilter: 'number: 4', cellClass: stateDownBold, type: 'number'},
                    { enableColumnMenu: false, field: 'leveraging',displayName: '杠杆' ,cellFilter: 'number: 4', cellClass: changeDateColor, type: 'number', cellTemplate:'<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col) | number:3}}{{row.entity.leveragingDate}}</div>',sortingAlgorithm: sortLeveraging},
                    { enableColumnMenu: false, field: 'assetMarketValue',displayName: '资产合计市值', cellFilter: 'number: 4', cellClass: changeStateFont,type: 'number'},
                    { enableColumnMenu: false, field: 'fundNetMarketValue',displayName: '产品净值市值', cellFilter: 'number: 4', cellClass: changeStateFont,type: 'number'},
                    { enableColumnMenu: false, field: 'standardSecuritySHAvailable',displayName: '上海标准券可用', cellFilter: 'number: 4', cellClass: changeStateFont,type: 'number'},
                    { enableColumnMenu: false, field: 'standardSecuritySZAvailable',displayName: '深圳标准券可用', cellFilter: 'number: 4', cellClass: changeStateFont,type: 'number'},
                ],
                onRegisterApi: function( gridApi ){
                    $scope.gridApi = gridApi;
                    gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                    });
                },
                enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
            };
            //查看
            $scope.showMore= function (item) {
                $rootScope.fundFundId = item.fundId;
                $location.path('/TKBondPositions').replace();
            }
            //杠杆排序
            function sortLeveraging(a, b, rowA, rowB, direction) {
                var x = new Date(rowA.entity.leveragingDate.split('| ')[1].replace('-', '/')).getTime(),
                    y = new Date(rowB.entity.leveragingDate.split('| ')[1].replace('-', '/')).getTime();
                if(x>y){
                    return 1
                }else {
                    return -1
                }
            }
            function changeStateColor(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row,col) >=0) {
                    return 'number_type tk_state_up';
                }else {
                    return 'number_type tk_state_down';
                }
            }
            function changeDateColor(grid, row, col, rowRenderIndex, colRenderIndex) {
                if(row.entity.leveragingDate == ' | '+$scope.computeDay){
                    return 'number_type';
                }else {
                    return 'number_type state_up';
                }
            }
            function changeStateFont(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row,col) >0) {
                    return 'number_type tk_state_normal_bold';
                }else {
                    return 'number_type';
                }
            }
            function stateDownBold(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row,col) >0) {
                    return 'number_type tk_state_down tk_state_normal_bold';
                }else {
                    return 'number_type tk_state_down';
                }
            }
            //事件通信
            $scope.$on("TKFundFunds", function (event, data) {
                // 这里取到发送过来的数据 data
                getFundFunds($rootScope.fundFundId, data.pageIndex, 10000);
            });
        }])
})