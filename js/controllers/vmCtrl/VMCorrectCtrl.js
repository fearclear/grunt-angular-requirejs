define(['app'], function (app) {
    return app.controller('VMCorrectCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', 'baseService',
        function ($scope, $rootScope, serverService, $cookies) {
            $rootScope.pageNow = 'vmCorrect';
            $rootScope.title = '估值管理';
            $rootScope.name = '估值修正'
            $rootScope.isPagination = false;
            $scope.vmFund = {}
            $scope.vmS = {
              vmFundId: 0
            }
            //ui-grid配置
            $scope.gridOptions = {
                enableGridMenu: true,
                enableSelectAll: true,
                exporterMenuPdf: false, // ADD THIS
                rowHeight: '42',
                exporterOlderExcelCompatibility: true,
                exporterCsvFilename: '估值修正.csv',
                exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
                columnDefs: [
                    { width: 50, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
                    { width: 150, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'fundName',displayName: '产品名称', cellClass: 'align_center'},
                    { width: 100, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'startDate',displayName: '开始时间', cellFilter: 'date: "yyyy-MM-dd"', cellClass: 'align_center'},
                    { width: 100, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'delta',displayName: '修正金额(元)', cellClass: 'number_type', type: 'number'},
                    { width: 100, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'modifyTime',displayName: '修改时间', cellFilter: 'date: "yyyy-MM-dd HH:mm:ss"', cellClass: 'align_center'},
                    { width: 100, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'stateShowName',displayName: '状态', cellClass: changeColor, cellTemplate:'<div class="ui-grid-cell-contents"><span class="state_child">{{grid.getCellValue(row, col)}}</span></div>'},
                    { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'note',displayName: '备注',cellTemplate:'<div class="ui-grid-cell-contents" title={{row.entity.note}}>{{grid.getCellValue(row, col)}}</div>'},
                    { width: 200, enableColumnMenu: false, headerCellClass: 'align_center', enableCellEdit: false, field: 'handle',displayName: '操作', cellClass: 'align_center', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer"><span><a href="javascript:;" class="main_color"  ng-click="grid.appScope.changeState(row.entity)">{{row.entity.stateName}}</a></span><span style="margin-left: 10px"><a href="javascript:;" class="main_color" ng-click="grid.appScope.showEdit(\'update\', row.entity)">修改</a></span><span style="margin-left: 10px"><a href="javascript:;" class="main_color" ng-click="grid.appScope.fixHistory(row.entity)">操作记录</a></span></div>'},
                ],
                onRegisterApi: function( gridApi ){
                    $scope.gridApi = gridApi;
                    gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
                        $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
                    });
                }
            };
            function changeColor(grid, row) {
                if(row.entity.state){
                    return 'tm_state_pass_parent align_center'
                }else{
                    return 'tm_state_normal_parent align_center'
                }
            }
            $scope.getFixRate = function (fundId) {
                fundId = fundId?fundId:0
                showLoading()
                serverService.getFixRate(fundId)
                    .then(function (data) {
                        hideLoading()
                        var count = 0
                        data.forEach(function (i) {
                            i.index = ++count
                            i.stateName = i.state==0?'启用': '禁用'
                            i.stateShowName = i.state==0?'禁用': '启用'
                        })
                        $scope.gridOptions.data = data
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.getFixRate(0)
            $scope.subState = function () {
                var item = $scope.closeItem
                item.state = item.state==0?1:0
                item.startDate = new Date(item.startDate).Format('yyyy-MM-dd')
                item.note1 = $scope.note1? encodeURIComponent($scope.note1) : ''
                serverService.changeFixrateState(item)
                    .then(function () {
                        $rootScope.isError = true
                        $rootScope.errText = item.stateName+'成功'
                        $scope.note1 = ''
                        $scope.isClose = false
                        $scope.closeItem = {}
                        $scope.getFixRate($scope.vmS.vmFundId)
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.changeState = function (item) {
                $scope.isClose = true
                $scope.closeItem = item
                $scope.closeTitle = item.stateName
                $scope.note1 = ''
            }
            $scope.cancelState = function () {
                $scope.note1 = ''
                $scope.isClose = false
                $scope.closeItem = {}
            }
            $scope.fixHistory = function (item) {
                $scope.isShowMoreList = true
                var fundId = item.fundId
                var workday = new Date(item.startDate).Format('yyyy-MM-dd')
                serverService.getFixratehistory(fundId, workday)
                    .then(function (data) {
                        $scope.items = data
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
            $scope.cancelShowMore = function () {
                $scope.isShowMoreList = false
            }
            //修正金额修改
            $scope.showEdit = function (flag, entity) {
                switch (flag){
                    case 'add':
                        $scope.vmFund.isUpdate = false
                        $scope.isEdit = true
                        break
                    case 'update':
                        $scope.vmFund = entity
                        $scope.vmFund.startDate = new Date(entity.startDate).Format('yyyy-MM-dd')
                        $scope.vmFund.fundId = ''+entity.fundId
                        $scope.vmFund.isUpdate = true
                        if(entity.state==0){
                            $rootScope.isError = true
                            $rootScope.errText = '请先启用规则'
                        }else{
                            $scope.isEdit = true
                        }
                        break
                    default:
                        break
                }
            }
            $scope.cancelEdit = function () {
                $scope.isEdit = false
                $scope.vmFund = {}
            }
            $scope.subEdit = function () {
                $scope.vmFund.delta = $scope.vmFund.delta || ''
                $scope.vmFund.startDate = $scope.vmFund.startDate || ''
                $scope.vmFund.note = encodeURIComponent($scope.vmFund.note) || ''
                serverService.updateFixRate($scope.vmFund)
                    .then(function () {
                        $rootScope.isError = true
                        $rootScope.errText = '提交成功'
                        $scope.getFixRate($scope.vmS.vmFundId)
                        $scope.isEdit = false
                        $scope.vmFund = {}
                    }, function (err) {
                        $scope.$emit('rejectError', err)
                    })
            }
        }])
})