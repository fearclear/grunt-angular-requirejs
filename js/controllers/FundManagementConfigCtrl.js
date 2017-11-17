'use strict';

define(['app'], function (app) {
    return app.controller('FundManagementConfigCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService', function ($scope, $rootScope, serverService, $cookies) {
        $rootScope.pageNow = 'fundManagementConfig';
        $rootScope.title = '产品管理';
        $rootScope.name = '估值报表参数';
        $rootScope.isPagination = true;
        $scope.fmFund = {};
        getFundTemplates(1, 17);
        function getFundTemplates(pageIndex, pageSize) {
            $rootScope.pageIndex = pageIndex;
            showLoading();
            serverService.getFundTemplates(pageIndex, pageSize).then(function (data) {
                hideLoading();
                $scope.items = data.listData;
                $rootScope.pageTotal = Math.ceil(data.totalCount / 17);
                $rootScope.totalCount = data.totalCount;
            }, function (err) {
                $scope.$emit('rejectError', err)
            });
        }
        //新增产品
        $scope.showEdit = function (flag, update) {
            $scope.tempList = {};
            $scope.isEdit = true;
            switch (flag) {
                case 'add':
                    $scope.isUpdate = false; //是否可修改
                    $scope.fmFund.title = '新增估值报表参数';
                    $scope.fmFund.confirm = '创建';
                    break;
                case 'edit':
                    $scope.isUpdate = true;
                    $scope.fmFund.title = '修改估值报表参数';
                    $scope.fmFund.confirm = '修改';
                    $scope.fmFund.fundId = update.fundId;
                    $scope.fmFund.fundCode = update.fundCode;
                    $scope.fmFund.displayName = update.displayName;
                    $scope.fmFund.displayOrder = update.displayOrder;
                    $scope.fmFund.compareRate = update.compareRate;
                    $scope.fmFund.originName = update.originName;
                    $scope.fmFund.showinResult = update.showinResult;
                    $scope.fmFund.templateClassify = update.templateClassify;
                    $scope.fmFund.backOneDate = update.backOneDate;
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
                $scope.tempList.displayName = $scope.fmFund.displayName || '';
                $scope.tempList.compareRate = $scope.fmFund.compareRate || '';
                $scope.tempList.originName = $scope.fmFund.originName || '';
                $scope.tempList.showinResult = $scope.fmFund.showinResult || false;
                $scope.tempList.templateClassify = $scope.fmFund.templateClassify || '';
                $scope.tempList.displayOrder = $scope.fmFund.displayOrder || '';
                $scope.tempList.backOneDate = $scope.fmFund.backOneDate || '';
                if(!$scope.tempList.backOneDate){
                    $rootScope.isError = true
                    $rootScope.errText = '归一时间不可以为空'
                    return
                }
                if ($scope.tempList.fundId) {
                    serverService.updateFundTemplates($scope.tempList).then(function () {
                        $rootScope.errText = '修改成功';
                        $rootScope.isError = true;
                        $scope.fmFund = {};
                        $scope.tempList = {};
                        $scope.isEdit = false;
                        getFundTemplates($rootScope.pageIndex, 17);
                        isFirstClick = true;
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                        isFirstClick = true;
                    });
                }
            }
        };
        //取消
        $scope.cancelEdit = function () {
            $scope.isEdit = false;
            $scope.fmFund = {};
            $scope.tempList = {};
        };
        //分页器
        $scope.$on('fundManagementConfig', function (ev, data) {
            getFundTemplates(data.pageIndex, 17);
        });
    }]);
});