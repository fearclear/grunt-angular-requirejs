define(['app'], function (app) {
    return app.controller('TKBondPositionsCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService',
        function ($scope, $rootScope, serverService, $cookies) {
            $rootScope.pageNow = 'TKBondPositions';
            $rootScope.pageIndex = '1';
            $rootScope.title = '交易看板';
            $rootScope.name = '债券持仓动态';
            $rootScope.isPagination = false
            $scope.key = {};
            function getBondAvailable(fundId, pageIndex, pageSize) {
                $rootScope.pageIndex = pageIndex;
                showLoading();
                serverService.getMoneyAvailable(fundId, pageIndex, pageSize)
                    .then(function (data) {
                        data.avadatalable = +data.avadatalable;
                        data.buyMoney = +data.buyMoney;
                        data.buyNewBond = +data.buyNewBond;
                        data.buyoutReverseRepo = +data.buyoutReverseRepo;
                        data.buyoutSellRepo = +data.buyoutSellRepo;
                        data.cash = +data.cash;
                        data.funddatad = +data.funddatad;
                        data.reverseRepo = +data.reverseRepo;
                        data.sellMoney = +data.sellMoney;
                        data.sellRepo = +data.sellRepo;
                        data.sellRepoDebt = +data.sellRepoDebt;
                        data.t0Buy = +data.t0Buy;
                        data.t0Recedatavable = +data.t0Recedatavable;
                        data.t0Sell = +data.t0Sell;
                        data.t1BuyDebt = +data.t1BuyDebt;
                        data.t1Debt = +data.t1Debt;
                        data.t1Recedatavable = +data.t1Recedatavable;
                        $scope.fundDetail = data;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    });
                serverService.getBondAvailable(fundId, pageIndex, pageSize)
                    .then(function (data) {
                        hideLoading();
                        if(data.list.length){
                            for(var t in data.list[0]){
                                $scope.key[t+'Key'] = false;
                                $scope.key[t+'Flag'] = true;
                            }
                        }
                        data.list.forEach(function (i) {
                            i.actualHolding = +i.actualHolding;
                            i.available = +i.available;
                            i.buyBond = +i.buyBond;
                            i.buyoutReverseRepoBond = +i.buyoutReverseRepoBond;
                            i.buyoutReverseRepoBondExpired = +i.buyoutReverseRepoBondExpired;
                            i.buyoutSellRepoBond = +i.buyoutSellRepoBond;
                            i.buyoutSellRepoBondExpired = +i.buyoutSellRepoBondExpired;
                            i.expireDays = +i.expireDays;
                            i.fundId = +i.fundId;
                            i.holding = +i.holding;
                            i.newBond = +i.newBond;
                            i.sellBond = +i.sellBond;
                            i.sellRepoBond = +i.sellRepoBond;
                            i.sellRepoBondAll = +i.sellRepoBondAll;
                            i.sellRepoBondExpired = +i.sellRepoBondExpired;
                            for(var j in i){
                                if(i[j]) {
                                    $scope.key[j + 'Flag'] = false;
                                }
                            }
                        })
                        changeVisible($scope.key, data.list);
                        $scope.items = data.list;
                        $scope.gridOptions.data = data.list;
                        var t = 0;
                        data.list.forEach(function (i) {
                            i.index = ++t;
                        })
                        if(data.list && data.list.length){
                            $scope.tkTicketTime = new Date(data.list[0].workday).Format('yyyy-MM-dd');
                        }
                        $rootScope.pageTotal = Math.ceil(data.count / 10000);
                        $rootScope.totalCount = data.count;
                        // $rootScope.fundFundId = 0;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    });
            }
            if($rootScope.fundFundId){
                $scope.fundName = +$rootScope.fundFundId
            }
            getBondAvailable($rootScope.fundFundId, 1, 100000);
            function showFundName(fundId) {
                for(var i=0;i<$scope.fundNames.length;i++){
                    if(fundId == $scope.fundNames[i].fundId){
                        $scope.fundNameTitle = $scope.fundNames[i].fundName;
                        $scope.fundName = $scope.fundNames[i].fundId;
                    }
                }
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
                enableColumnMenu: false,
                enableGridMenu: true,
                enableSelectAll: true,
                rowHeight: '42px',
                exporterMenuPdf: false, // ADD THIS
                exporterCsvFilename: '产品资金动态表.csv',
                exporterOlderExcelCompatibility: true,
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                columnDefs: [
                    { enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number' },
                    { enableColumnMenu: false, field: 'securityId',displayName: '债券代码'},
                    { enableColumnMenu: false, field: 'marketName',displayName: '交易市场'},
                    { enableColumnMenu: false, field: 'securityName',displayName: '债券名称',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" title="{{row.entity.bondShowMore}}" ng-click="grid.appScope.showMoreList(row.entity)">{{grid.getCellValue(row, col)}}</div>'},
                    { enableColumnMenu: false, field: 'industry',displayName: '行业', cellClass: 'align_center'},
                    { enableColumnMenu: false, field: 'companyType',displayName: '公司类型', cellClass: 'align_center'},
                    { enableColumnMenu: false, field: 'companyRating',displayName: '公司评级', cellClass: 'align_center'},
                    { enableColumnMenu: false, field: 'available',displayName: '可用' ,cellFilter: 'number: 0', cellClass: changeStateColor, type: 'number'},
                    { enableColumnMenu: false, field: 'holding',displayName: '持仓'  ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'sellRepoBondExpired',displayName: '今日到期'  ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'creditRating',displayName: '信用评级', cellClass: 'align_center'},
                    { enableColumnMenu: false, field: 'expireDays',displayName: '剩余天数' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'paymentBond',displayName: '兑付' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number' },
                    { enableColumnMenu: false, field: 'sellBond',displayName: '卖出' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number' },
                    { enableColumnMenu: false, field: 'buyBond',displayName: '买入' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'buyoutSellRepoBond',displayName: '买断式正回购' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'buyoutSellRepoBondExpired',displayName: '买断式正回购到期' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'buyoutReverseRepoBond',displayName: '买断式逆回购' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'buyoutReverseRepoBondExpired',displayName: '买断式逆回购到期' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'sellRepoBond',displayName: '今日质押' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'sellRepoBondAll',displayName: '总质押' ,cellFilter: 'number: 0', cellClass: changeStateFont, type: 'number'},
                    { enableColumnMenu: false, field: 'convRate',displayName: '折算率', cellClass: changeStateFont,cellTemplate:'<div class="ui-grid-cell-contents">{{grid.getCellValue(row, col) || "--"}}</div>' },
                    { enableColumnMenu: false, field: 'standardSecurity',displayName: '标准券', cellClass: changeStateFont,type: 'number'},
                ],
                onRegisterApi: function( gridApi ){
                    $scope.gridApi = gridApi;
                    $scope.gridApi.grid.registerRowsProcessor( $scope.filSel, 200 );
                    gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                    });
                },
                enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
            };
            serverService.getFundParameters()
                .then(function (data) {
                    $scope.fundNames = data;
                    showFundName($rootScope.fundFundId);
                }, function (err) {
                    $scope.$emit('rejectError', err)
                });

            function changeStateColor(grid, row, col, rowRenderIndex, colRenderIndex) {
                if (grid.getCellValue(row,col) >=0) {
                    return 'number_type tk_state_up';
                }else {
                    return 'number_type tk_state_down';
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
            //查看详情
            $scope.showMoreList = function (item) {
                $scope.isShowMoreList = true;
                serverService.getWarningBondName(item.fundId, item.securityName)
                    .then(function (data) {
                        $scope.showMoreItems = data;
                        item.bondShowMore = '';
                        data.forEach(function (i) {
                            item.bondShowMore += '[' + i.bondName + ',' + i.bondNumber + ',' + i.dueDate + ']\n'
                        })
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.cancelShowMore = function () {
                $scope.isShowMoreList = false;
                $scope.showMoreItems = {};
            }
            //选择基金过滤
            $scope.showSelFund = function (fundId) {
                getBondAvailable(fundId, 1, 100000);
                showFundName(fundId);
                $rootScope.fundFundId = fundId;
            }
            //过滤
            $scope.filByMarket = function (value) {
                switch (value){
                    case '0':
                        $scope.market = '0';
                        break;
                    case '1':
                        $scope.market = '1';
                        break;
                    case '2':
                        $scope.market = '2';
                        break;
                    case '3':
                        $scope.market = '3';
                        break;
                    default:
                        $scope.market = '';
                        break;
                }
                if($scope.gridApi){
                    $scope.gridApi.grid.refresh();
                }
            }
            $scope.filByMarket(null);
            $scope.sel = {}
            $scope.filSel = function (renderableRows) {
                var markName = new RegExp($scope.sel.market||'')
                renderableRows.forEach( function( row ) {
                    var match = false;
                    if(markName.test(row.entity.marketName)) {
                        match = true
                    }
                    if ( !match ){
                        row.visible = false;
                    }
                });
                return renderableRows;
            }
            $scope.params = {
                market: [
                    {
                        name: '银行间',
                    },
                    {
                        name: '交易所',
                    },
                    {
                        name: '其他'
                    }
                ]
            }
            //事件通信
            $scope.$on("TKBondPositions", function (event, data) {
                // 这里取到发送过来的数据 data
                getBondAvailable($rootScope.fundFundId, data.pageIndex, 10000);
            });
            $scope.filename = "test";
            // $scope.getArray = [{a:'序号', b:'内容'},{a: 1, b:2}, {a:3, b:4}];
            document.addEventListener('keydown', pushCloseShowMore);
            function pushCloseShowMore(ev) {
                if(ev.keyCode==27 && $rootScope.pageNow=='TKBondPositions'){
                    $scope.isShowMoreList = false;
                    $scope.showMoreItems = {};
                }else if($rootScope.pageNow != 'TKBondPositions'){
                    document.removeEventListener('keydown', pushCloseShowMore)
                }
            }
        }])
})