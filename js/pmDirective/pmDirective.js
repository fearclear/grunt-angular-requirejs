/**
 * pmDirective
 */
define(['app'], function (app) {
    return app
        .directive('pmSpot', ['serverService', '$rootScope', 'i18nService', 'uiGridConstants', function (serverService, $rootScope, i18nService, uiGridConstants) {
            return {
                restrict: 'AE',
                templateUrl: 'js/pmDirective/pmSpot.html',
                link: function (scope, element, attr, ngModel) {
                    scope.key = {}
                    //查询数据
                    scope.getRiskBond = function (workday) {
                        if(workday){
                            showLoading()
                            serverService.getRiskBond(workday)
                                .then(function (data) {
                                    hideLoading()
                                    if(data.length){
                                        for(var t in data[0]){
                                            scope.key[t+'Key'] = false;
                                            scope.key[t+'Flag'] = true;
                                        }
                                    }
                                    scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.COLUMN);
                                    data.forEach(function (i) {
                                        for(var j in i){
                                            if(i[j]) {
                                                scope.key[j + 'Flag'] = false;
                                            }
                                        }
                                    })
                                    changeVisible(scope.key, data)
                                    scope.gridOptions.data = data
                                }, function (err) {
                                    hideLoading()
                                    if(err && err.text){
                                        $rootScope.isError = true
                                        $rootScope.errText = err.text
                                    }
                                })
                        }
                    }
                    //全都没有则不可见
                    function changeVisible(arr, list){
                        list.forEach(function (j) {
                            for(var i in j){
                                if(arr[i+'Flag']){
                                    var pos = scope.gridOptions.columnDefs.map(function (e) { return e.field; }).indexOf(i);
                                    if(i!='fundName' && i!='isConvertible' && i!='isRateBond' && scope.gridOptions.columnDefs[pos]){
                                        scope.gridOptions.columnDefs[pos].visible = false;
                                    }
                                }
                            }
                        })
                    }
                    //ui-grid配置
                    scope.gridOptions = {
                        enableGridMenu: true,
                        enableSelectAll: true,
                        exporterMenuPdf: false, // ADD THIS
                        rowHeight: '42',
                        exporterOlderExcelCompatibility: true,
                        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                        columnDefs: [
                            { enableColumnMenu: false, enableCellEdit: false, field: 'fundName',displayName: '组合名字', cellClass: 'align_center', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: true, field: 'isConvertible',displayName: '区分可转债', cellClass: 'align_center', editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'mapPMState', editDropdownOptionsArray: [
                                { id: 0, value: '0' },
                                { id: 1, value: '1' },
                            ]},
                            { enableColumnMenu: false, enableCellEdit: true, field: 'isRateBond',displayName: '利率债', cellClass: 'align_center', editableCellTemplate: 'ui-grid/dropdownEditor', cellFilter: 'mapPMState', editDropdownOptionsArray: [
                                { id: 0, value: '0' },
                                { id: 1, value: '1' },
                            ]},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'iWindCode',displayName: '债券代码', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'bondName',displayName: '债券名称', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'bondVolume',displayName: '数量', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'couponrate',displayName: '票面', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'yield',displayName: '收益率(%)', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'net',displayName: '净价', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'dirtyprice',displayName: '全价', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'matu',displayName: '期限(年)', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'modidura',displayName: '修正久期', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'carry',displayName: 'Carry', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'amount',displayName: '债项评级', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'latestissurercreditrating',displayName: '主体评级', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'bondAmount',displayName: '量*净价(中债)', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'maturitydate',displayName: '到期日', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'interestfrequency',displayName: '付息次数', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'paymentdate1',displayName: '付息日一', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'paymentdate2',displayName: '付息日二', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'yield_csi',displayName: '中证收益率', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'net_csi',displayName: '中证净价', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'modidura_csi',displayName: '中证修正久期', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'yield_shc',displayName: '上清收益率', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'net_shc',displayName: '上清净价', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'modidura_shc',displayName: '上清修正久期', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'carrydate',displayName: '起息日期', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'maturitydate',displayName: '到期日期', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'ipo_date',displayName: '上市日期', cellClass: 'align_center'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'nature',displayName: '企业性质', cellClass: 'align_center'},
                        ],
                        onRegisterApi: function( gridApi ){
                            scope.gridApi = gridApi;
                            gridApi.core.on.columnVisibilityChanged( scope, function( changedColumn ){
                                scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                            });
                            gridApi.edit.on.afterCellEdit(scope,function(rowEntity, colDef, newValue, oldValue){
                                if(newValue == oldValue){
                                    return;
                                }
                                var data = {
                                    iWindCode: rowEntity.iWindCode,
                                    isConvertible: rowEntity.isConvertible,
                                    isRateBond: rowEntity.isRateBond
                                }
                                if(data.iWindCode){
                                    serverService.updateRiskBond(data)
                                        .then(function () {

                                        }, function (err) {
                                            if(err && err.text){
                                                $rootScope.isError = true
                                                $rootScope.errText = err.text
                                            }
                                        })
                                }else {
                                    $rootScope.isError = true
                                    $rootScope.errText = '债券代码错误'
                                    rowEntity[colDef.field]=oldValue
                                }

                            });
                        }
                    };
                    scope.saveRow = function( rowEntity ) {
                        scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
                    };
                }
            }
        }])
        .directive('pmRatePlate', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/pmDirective/pmRatePlate.html',
                link: function (scope, element, attr, ngModel) {
                    scope.getRatePlate = function (workday) {
                        if(workday){
                            showLoading()
                            serverService.getFuture(workday)
                                .then(function (data) {
                                    hideLoading()
                                    scope.rateData = data
                                    scope.gridRatePlateOptions.data = data.list
                                }, function (err) {
                                    hideLoading()
                                    if(err && err.text){
                                        $rootScope.isError = true
                                        $rootScope.errText = err.text
                                    }
                                })
                        }
                    }
                    //ui-grid配置
                    scope.gridRatePlateOptions = {
                        enableGridMenu: false,
                        enableSelectAll: true,
                        exporterMenuPdf: false, // ADD THIS
                        rowHeight: '42',
                        exporterOlderExcelCompatibility: true,
                        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                        columnDefs: [
                            { enableColumnMenu: false, enableCellEdit: false, field: 'fundName',displayName: '', cellClass: 'align_center pm_table_th', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'startInterest',displayName: '期初权益', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'endInterest',displayName: '期末权益', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'todayProfit',displayName: '当日盈亏', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'preProfit',displayName: '前日累计盈亏', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'allProfit',displayName: '小计', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'handle',displayName: '持仓', cellClass: 'align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer"><a href="javascript:;" ng-click="grid.appScope.showMore(row.entity)" class="main_color pointer">查看</a></div>'},
                        ],
                        onRegisterApi: function( gridApi ){
                            scope.gridApi = gridApi;
                            gridApi.core.on.columnVisibilityChanged( scope, function( changedColumn ){
                                scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                            });
                            gridApi.edit.on.afterCellEdit(scope,function(rowEntity, colDef, newValue, oldValue){
                                if(newValue == oldValue){
                                    return;
                                }
                                var data = {
                                    iWindCode: rowEntity.iWindCode,
                                    isConvertible: rowEntity.isConvertible,
                                    isRateBond: rowEntity.isRateBond
                                }
                                if(data.iWindCode){
                                    serverService.updateRiskBond(data)
                                        .then(function () {

                                        }, function (err) {
                                            if(err && err.text){
                                                $rootScope.isError = true
                                                $rootScope.errText = err.text
                                            }
                                        })
                                }else {
                                    $rootScope.isError = true
                                    $rootScope.errText = '债券代码错误'
                                    rowEntity[colDef.field]=oldValue
                                }

                            });
                        }
                    };
                    //查看更多
                    scope.showMore = function (item) {
                        scope.showMoreFuture = true
                        serverService.getFuturePosition(new Date(item.workday).Format('yyyy-MM-dd'), item.fundId)
                            .then(function (data) {
                                scope.futureDetail = data
                            }, function (err) {
                                if(err && err.text){
                                    $rootScope.isError = true
                                    $rootScope.errText = err.text
                                }
                            })
                    }
                    scope.cancelShowMoreFuture = function () {
                        scope.showMoreFuture = false
                        scope.futureDetail = []
                    }
                    //录入future
                    scope.addFuture = function () {
                        scope.isEditFuture = true
                    }
                    scope.cancelEdit = function () {
                        scope.isEditFuture = false
                        scope.pmFundRate = {}
                    }
                    scope.subEdit = function () {
                        serverService.addFuture(scope.pmFundRate)
                            .then(function () {
                                $rootScope.isError = true
                                $rootScope.errText = '提交成功'
                                scope.pmFundRate = {}
                                scope.isEditFuture = false
                                scope.getRatePlate(scope.pmS.ratePlateWorkday)
                            }, function (err) {
                                if(err && err.text){
                                    $rootScope.isError = true
                                    $rootScope.errText = err.text
                                }
                            })
                    }
                }
            }
        }])
        .directive('pmFunding', ['serverService', '$rootScope', function (serverService, $rootScope) {
            return {
                restrict: 'AE',
                templateUrl: 'js/pmDirective/pmFunding.html',
                link: function (scope, element, attr, ngModel) {
                    scope.getFunding = function (workday) {
                        if(workday){
                            showLoading()
                            serverService.getFunding(workday)
                                .then(function (data) {
                                    hideLoading()
                                    scope.gridFundingOptions.data = data
                                }, function (err) {
                                    hideLoading()
                                    if(err && err.text){
                                        $rootScope.isError = true
                                        $rootScope.errText = err.text
                                    }
                                })
                        }
                    }
                    //ui-grid配置
                    scope.gridFundingOptions = {
                        enableGridMenu: false,
                        enableSelectAll: true,
                        exporterMenuPdf: false, // ADD THIS
                        rowHeight: '42',
                        exporterOlderExcelCompatibility: true,
                        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                        columnDefs: [
                            { enableColumnMenu: false, enableCellEdit: false, field: 'fundName',displayName: '产品名称', cellClass: 'align_center', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'capital',displayName: '本金', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'costPercent',displayName: '资金成本', cellClass: 'number_type', type: 'number'},
                            { enableColumnMenu: false, enableCellEdit: false, field: 'daily',displayName: '每天', cellClass: 'number_type', type: 'number'},
                        ],
                        onRegisterApi: function( gridApi ){
                            scope.gridApi = gridApi;
                            gridApi.core.on.columnVisibilityChanged( scope, function( changedColumn ){
                                scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                            });
                        }
                    };
                    scope.addFunding = function () {
                        scope.isEditFunding = true

                    }
                    scope.cancelFundingEdit = function () {
                        scope.isEditFunding = false
                    }
                    scope.subFundingEdit = function () {
                        serverService.addFunding(scope.pmFundFunding)
                            .then(function (data) {
                                $rootScope.isError = true
                                $rootScope.errText = '添加成功'
                                scope.pmFundFunding = {}
                                scope.isEditFunding = false
                                scope.getFunding(scope.pmS.fundingWorkday)
                            }, function (err) {
                                if(err && err.text){
                                    $rootScope.isError = true
                                    $rootScope.errText = err.text
                                }
                            })
                    }
                }
            }
        }])
        .filter('mapPMState', function() {
            var stateHash = {
                0: '0',
                1: '1',
            };
            return function(input) {
                return stateHash[input];
            };
        })
})