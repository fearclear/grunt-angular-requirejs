'use strict';

define(['app'], function (app) {
    return app.controller('FundManagementCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', 'baseService', function ($scope, $rootScope, serverService, $cookies, $timeout) {
        $rootScope.pageNow = 'fundManagement';
        $rootScope.title = '产品管理';
        $rootScope.name = '产品基本信息';
        $rootScope.isPagination = false;
        $scope.showMoreForm = 1;
        $scope.fmFund = {};
        getFund(1, 1000);
        function getFund(pageIndex, pageSize) {
            $rootScope.pageIndex = pageIndex;
            showLoading();
            serverService.getFund(pageIndex, pageSize).then(function (data) {
                hideLoading();
                data.listData.forEach(function (i) {
                    i.amount = +i.amount/100000000;
                    i.nowAmount = +i.nowAmount/100000000;
                    switch (i.state){
                        case '未上市':
                            i.state = 1;
                            break;
                        case '正常':
                            i.state = 2;
                            break;
                        case '到期':
                            i.state = 3;
                            break;
                        default:
                            break;
                    }
                })
                $scope.items = data.listData;
                $scope.gridOptions.data = data.listData;
                var t = 0;
                data.listData.forEach(function (i) {
                    i.index = ++t;
                })
                $rootScope.pageTotal = Math.ceil(data.totalCount / 1000);
                $rootScope.totalCount = data.totalCount;
            }, function (err) {
                $scope.$emit('rejectError', err)
            });
        }
        $scope.gridOptions = {
            enableGridMenu: true,
            enableSelectAll: true,
            exporterMenuPdf: false, // ADD THIS
            rowHeight: '42',
            exporterOlderExcelCompatibility: true,
            exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
            columnDefs: [
                { width: 50,  visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'fundCode',displayName: '产品代码', cellClass: 'main_color align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'fundName',displayName: '产品简称', cellClass: 'main_color align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: true, editableCellTemplate: 'ui-grid/dropdownEditor',cellFilter: 'mapState',  field: 'state', displayName: '产品状态', cellClass: 'align_center', editDropdownOptionsArray: [
                    { id: 1, value: '未上市' },
                    { id: 2, value: '正常' },
                    { id: 3, value: '到期' }
                ]},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'fundType',displayName: '产品类型', cellClass: 'align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'administration',displayName: '主动管理', cellClass: 'align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'startTime',displayName: '成立日期', cellClass: 'align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'profit',displayName: '参考收益(%)', cellClass: 'main_color number_type', type: 'number'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'fundChannel',displayName: '托管渠道', cellClass: 'align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'userName',displayName: '产品负责人', cellClass: 'align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'amount',displayName: '募集规模(亿)', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'nowAmount',displayName: '最新规模(亿)', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'nowNetFund',displayName: '最新净值', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'nowProfit',displayName: '成立以来收益', cellFilter: 'number: 4', cellClass: 'number_type', type: 'number'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'originName',displayName: '估值表名称', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'record',displayName: '投资顾问', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'trusteeAgency',displayName: '托管机构', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'investmentStrategy',displayName: '投资策略', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'productMix',displayName: '产品结构', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'commissionBroker',displayName: '证券经纪商', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'futuresTrader',displayName: '期货经纪商', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'recordCode',displayName: '协会备案编码', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'isShare',displayName: '是否分红', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'open',displayName: '开放期', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'haveTrade',displayName: '有无交易户', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'valuationType',displayName: '估值法', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'leverage',displayName: '杠杆', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'bondFutures',displayName: '国债期货', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'levelA',displayName: '分级A', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'PPN',displayName: 'PPN', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'changeBond',displayName: '可转债', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'stopLoss',displayName: '止损线', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'warning',displayName: '预警线', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'sellFee',displayName: '销售费', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'custodianFee',displayName: '托管费', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'managerFee',displayName: '管理费', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'moreInto',displayName: '超额分成', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'fixedFee',displayName: '固定投顾费', cellClass: 'align_center'},
                { width: '**',visible: false, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'baseAchievement',displayName: '业绩基准', cellClass: 'align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'note',displayName: '备注', cellClass: 'align_center'},
                { width: '**',visible: true, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'handle',displayName: '操作', cellClass: 'main_color align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer" ng-click="grid.appScope.showEdit(\'edit\', row.entity)"><span><a href="javascript:;" class="main_color" ng-click="update(item)">修改</a></span></div>'},
            ],
            onRegisterApi: function( gridApi ){
                $scope.gridApi = gridApi;
                gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                    $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                });
                gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
                    if(newValue == oldValue){
                        return;
                    }
                    switch (newValue){
                        case 1:
                            rowEntity.state = oldValue;
                            break;
                        case 2:
                            serverService.pushFundStart(rowEntity.fundId)
                                .then(function () {
                                    $rootScope.errText = '修改成功';
                                    $rootScope.isError = true;
                                    refreshDate()
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                            break;
                        case 3:
                            serverService.deleteFund(rowEntity.fundId)
                                .then(function () {
                                    $rootScope.errText = '修改成功';
                                    $rootScope.isError = true;
                                    refreshDate()
                                }, function (err) {
                                    $scope.$emit('rejectError', err)
                                })
                            break;
                        default:
                            break;
                    }
                });
            },
            enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
        };
        $scope.saveRow = function( rowEntity ) {
            $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise );
        };
        $scope.changeShowMoreForm = function (flag) {
            var tempPage = $scope.showMoreForm+flag;
            if(tempPage<1||tempPage>3){
                tempPage = 0;
            }else {
                tempPage = flag;
            }
            $scope.showMoreForm += tempPage;
        }
        serverService.getFundType().then(function (data) {
            $scope.fundTypes = data;
        }, function (err) {
            $scope.$emit('rejectError', err)
        });
        serverService.getFundChannel().then(function (data) {
            $scope.fundChannels = data;
        }, function (err) {
            $scope.$emit('rejectError', err)
        });
        //新增产品
        $scope.showEdit = function (flag, update) {
            $scope.tempList = {};
            $scope.isEdit = true;
            switch (flag) {
                case 'add':
                    $scope.isUpdate = false; //是否可修改
                    $scope.fmFund = {
                      title: '新增产品',
                      confirm: '创建',
                      productMix: '平层',
                      valuationType: '成本法',
                      haveTrade: '有',
                      isShare: '是',
                      record: '蓝石资管',
                    }
                    break;
                case 'edit':
                    $scope.isUpdate = true;
                    $scope.fmFund.title = '修改产品';
                    $scope.fmFund.confirm = '修改';
                    $scope.fmFund.fundId = update.fundId;
                    $scope.fmFund.fundCode = update.fundCode;
                    $scope.fmFund.fundName = update.fundName;
                    $scope.fmFund.fundType = update.fundTypeCode;
                    $scope.fmFund.administration = update.administration;
                    $scope.fmFund.startTime = update.startTime;
                    $scope.fmFund.profit = update.profit;
                    $scope.fmFund.fundChannel = update.fundChannelCode;
                    $scope.fmFund.amount = update.amount*10000;
                    $scope.fmFund.nowAmount = update.nowAmount*10000;
                    $scope.fmFund.nowNetFund = update.nowNetFund;
                    $scope.fmFund.nowProfit = update.nowProfit;
                    $scope.fmFund.productName = update.productName;
                    $scope.fmFund.nextOpenDate = update.nextOpenDate;
                    $scope.fmFund.endDate = update.endDate;
                    $scope.fmFund.nextBonusDate = update.nextBonusDate;
                    $scope.fmFund.record = update.record;
                    $scope.fmFund.haveTrade = update.haveTrade;
                    $scope.fmFund.baseAchievement = update.baseAchievement;
                    $scope.fmFund.fixedFee = update.fixedFee;
                    $scope.fmFund.moreInto = update.moreInto;
                    $scope.fmFund.managerFee = update.managerFee;
                    $scope.fmFund.custodianFee = update.custodianFee;
                    $scope.fmFund.sellFee = update.sellFee;
                    $scope.fmFund.warning = update.warning;
                    $scope.fmFund.stopLoss = update.stopLoss;
                    $scope.fmFund.changeBond = update.changeBond;
                    $scope.fmFund.ppn = update.ppn;
                    $scope.fmFund.levelA = update.levelA;
                    $scope.fmFund.bondFutures = update.bondFutures;
                    $scope.fmFund.leverage = update.leverage;
                    $scope.fmFund.valuationType = update.valuationType;
                    $scope.fmFund.fundLongName = update.fundLongName;
                    $scope.fmFund.investmentAdviser = update.investmentAdviser;
                    $scope.fmFund.trusteeAgency = update.trusteeAgency;
                    $scope.fmFund.investmentStrategy = update.investmentStrategy;
                    $scope.fmFund.productMix = update.productMix;
                    $scope.fmFund.commissionBroker = update.commissionBroker;
                    $scope.fmFund.futuresTrader = update.futuresTrader;
                    $scope.fmFund.recordCode = update.recordCode;
                    $scope.fmFund.specialAccount = update.specialAccount;
                    $scope.fmFund.association = update.association;
                    $scope.fmFund.isShare = update.isShare;
                    $scope.fmFund.open = update.open;
                    $scope.fmFund.openDate = update.openDate;
                    $scope.fmFund.note = update.note;
                    $scope.fmFund.userId = update.groupUserId;
                    if ($scope.fmFund.administration === '是') {
                        $scope.fmFund.administration = 'yes';
                    } else if ($scope.fmFund.administration === '否') {
                        $scope.fmFund.administration = 'no';
                    }
                    break;
                default:
                    break;
            }
        };

        //确认
        var isFirstClick = true;
        $scope.subEdit = function () {
            if(isFirstClick){
                isFirstClick = false;
                $scope.tempList.fundId = $scope.fmFund.fundId || '';
                $scope.tempList.fundCode = $scope.fmFund.fundCode || '';
                $scope.tempList.userId = $scope.fmFund.userId || '';
                $scope.tempList.fundLongName = $scope.fmFund.fundLongName || '';
                $scope.tempList.fundName = $scope.fmFund.fundName || '';
                $scope.tempList.fundType = $scope.fmFund.fundType || '';
                $scope.tempList.administration = $scope.fmFund.administration || 'yes';
                $scope.tempList.isShare = $scope.fmFund.isShare || '是';
                $scope.tempList.fundChannel = $scope.fmFund.fundChannel || '';
                $scope.tempList.profit = $scope.fmFund.profit || 0;
                $scope.tempList.amount = $scope.fmFund.amount*10000 || 0;
                $scope.tempList.nowAmount = $scope.fmFund.nowAmount*10000 || 0;
                $scope.tempList.nowNetFund = $scope.fmFund.nowNetFund || '';
                $scope.tempList.nowProfit = $scope.fmFund.nowProfit || '';
                $scope.tempList.note = $scope.fmFund.note || '';
                $scope.tempList.startTime = $scope.fmFund.startTime || '';
                $scope.tempList.productName = $scope.fmFund.productName || '';
                $scope.tempList.nextOpenDate = $scope.fmFund.nextOpenDate || '';
                $scope.tempList.endDate = $scope.fmFund.endDate || '';
                $scope.tempList.haveTrade = $scope.fmFund.haveTrade || '';
                $scope.tempList.record = $scope.fmFund.record || '';
                $scope.tempList.nextBonusDate = $scope.fmFund.nextBonusDate?encodeURI($scope.fmFund.nextBonusDate):'';
                $scope.tempList.baseAchievement = $scope.fmFund.baseAchievement?encodeURI($scope.fmFund.baseAchievement):'';
                $scope.tempList.fixedFee = $scope.fmFund.fixedFee?encodeURI($scope.fmFund.fixedFee):'';
                $scope.tempList.moreInto = $scope.fmFund.moreInto?encodeURI($scope.fmFund.moreInto):'';
                $scope.tempList.managerFee = $scope.fmFund.moreInto?encodeURI($scope.fmFund.managerFee):'';
                $scope.tempList.custodianFee = $scope.fmFund.custodianFee?encodeURI($scope.fmFund.custodianFee):'';
                $scope.tempList.sellFee = $scope.fmFund.sellFee?encodeURI($scope.fmFund.sellFee):'';
                $scope.tempList.warning = $scope.fmFund.warning?encodeURI($scope.fmFund.warning):'';
                $scope.tempList.stopLoss = $scope.fmFund.stopLoss?encodeURI($scope.fmFund.stopLoss):'';
                $scope.tempList.changeBond = $scope.fmFund.changeBond?encodeURI($scope.fmFund.changeBond):'';
                $scope.tempList.ppn = $scope.fmFund.ppn?encodeURI($scope.fmFund.ppn):'';
                $scope.tempList.levelA = $scope.fmFund.levelA?encodeURI($scope.fmFund.levelA):'';
                $scope.tempList.bondFutures = $scope.fmFund.bondFutures?encodeURI($scope.fmFund.bondFutures):'';
                $scope.tempList.leverage = $scope.fmFund.leverage?encodeURI($scope.fmFund.leverage):'';
                $scope.tempList.investmentAdviser = $scope.fmFund.investmentAdviser?encodeURI($scope.fmFund.investmentAdviser):'';
                $scope.tempList.trusteeAgency = $scope.fmFund.trusteeAgency?encodeURI($scope.fmFund.trusteeAgency):'';
                $scope.tempList.investmentStrategy = $scope.fmFund.investmentStrategy?encodeURI($scope.fmFund.investmentStrategy):'';
                $scope.tempList.productMix = $scope.fmFund.productMix?encodeURI($scope.fmFund.productMix):'';
                $scope.tempList.commissionBroker = $scope.fmFund.commissionBroker?encodeURI($scope.fmFund.commissionBroker):'';
                $scope.tempList.futuresTrader = $scope.fmFund.futuresTrader?encodeURI($scope.fmFund.futuresTrader):'';
                $scope.tempList.recordCode = $scope.fmFund.recordCode?encodeURI($scope.fmFund.recordCode):'';
                $scope.tempList.association = $scope.fmFund.association?encodeURI($scope.fmFund.association):'';
                $scope.tempList.specialAccount = $scope.fmFund.specialAccount?encodeURI($scope.fmFund.specialAccount):'';
                $scope.tempList.open = $scope.fmFund.open?encodeURI($scope.fmFund.open):'';
                $scope.tempList.openDate = $scope.fmFund.openDate?encodeURI($scope.fmFund.openDate):'';
                $scope.tempList.valuationType = $scope.fmFund.valuationType?encodeURI($scope.fmFund.valuationType):'';
                for(var i in $scope.tempList){
                    $scope.tempList[i] = $scope.tempList[i]==='--'?'':$scope.tempList[i]
                }
                if ($scope.tempList.fundType && $scope.tempList.fundCode && $scope.tempList.fundName) {
                    if ($scope.tempList.fundId) {
                        serverService.updateFund($scope.tempList).then(function () {
                            $rootScope.errText = '修改成功';
                            $rootScope.isError = true;
                            $scope.fmFund = {};
                            $scope.tempList = {};
                            $scope.isEdit = false;
                            getFund($rootScope.pageIndex, 1000);
                            refreshDate()
                            isFirstClick = true;
                        }, function (err) {
                            $scope.$emit('rejectError', err)
                            isFirstClick = true;
                        });
                    } else {
                        serverService.createFund($scope.tempList).then(function () {
                            $rootScope.errText = '创建成功';
                            $rootScope.isError = true;
                            $scope.fmFund = {};
                            $scope.tempList = {};
                            $scope.isEdit = false;
                            getFund($rootScope.pageIndex, 1000);
                            refreshDate()
                            isFirstClick = true;
                        }, function (err) {
                            $scope.$emit('rejectError', err)
                            isFirstClick = true;
                        });
                    }
                } else {
                    $rootScope.isError = true;
                    $rootScope.errText = '请输入产品代码，产品简称和产品类型';
                    isFirstClick = true;
                }
            }
        };
        //取消
        $scope.cancelEdit = function () {
            $scope.isEdit = false;
            $scope.fmFund = {
                administration: 'yes'
            };
            $scope.tempList = {};
        };
        //分页器
        $scope.$on('fundManagement', function (ev, data) {
            getFund(data.pageIndex, 1000);
        });
        //刷新缓存数据
        function refreshDate() {
            $timeout(function () {
              $scope.$emit('getParams')
            }, 2000)
        }
    }])
    .filter('mapState', function() {
        var stateHash = {
            1: '未上市',
            2: '正常',
            3: '到期'
        };

        return function(input) {
            if (!input){
                return '';
            } else {
                return stateHash[input];
            }
        };
    });
});