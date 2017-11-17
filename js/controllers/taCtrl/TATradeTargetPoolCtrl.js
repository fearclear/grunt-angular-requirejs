define(['app'], function (app) {
  return app.controller('TATradeTargetPoolCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', 'baseService', function ($scope, $rootScope, serverService, $cookies, $timeout) {
    $rootScope.title = '国债账户';
    $rootScope.name = '投资合约池';
    $rootScope.pageNow = 'taTradeTargetPool';
    $rootScope.pageIndex = 1;
    $scope.tmFund = {};
    $rootScope.isPagination = true
    getTradeTargetPool(1, 17);
    function getTradeTargetPool(pageIndex, pageSize) {
      $rootScope.pageIndex = pageIndex;
      showLoading();
      serverService.getTradeTargetPool(pageIndex, pageSize).then(function (data) {
        hideLoading();
        var count = 0
        data.listData.forEach(function (i) {
          i.index = ++count
        })
        $scope.gridOptions2.data = data.listData;
        $rootScope.pageTotal = Math.ceil(data.TotalCount / 17);
        $rootScope.totalCount = data.TotalCount;
      }, function (err) {
        $scope.$emit('rejectError', err)
      });
    }

    //提交表单
    $scope.showEdit = function (flag, update) {
      $scope.tempList = {};
      $scope.isEdit = true;
      switch (flag) {
        case 'add':
          $scope.isUpdate = false; //是否可修改
          $scope.tmFund.name = '新增投资合约';
          $scope.tmFund.confirm = '确认';
          break;
        case 'edit':
          $scope.isUpdate = true;
          $scope.tmFund.name = '交易对手修改';
          $scope.tmFund.confirm = '修改';
          $scope.tmFund.id = update.id;
          $scope.tmFund.title = update.title;
          $scope.tmFund.qq = update.qq;
          $scope.tmFund.contact = update.contact;
          $scope.tmFund.phone = update.phone;
          break;
        default:
          break;
      }
    };
    $scope.gridOptions2 = {
      enableGridMenu: false,
      enableSelectAll: true,
      exporterMenuPdf: false, // ADD THIS
      rowHeight: '42',
      exporterOlderExcelCompatibility: true,
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
      columnDefs: [
        { width: 50, headerCellClass: 'align_center',enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'TradeTarget',displayName: '合约号', cellClass: 'align_center'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'iWindCode',displayName: '万得代码', cellClass: 'align_center'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'Note',displayName: '备注', cellClass: 'align_center'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'handle',displayName: '操作', cellClass: 'main_color align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer"><span ng-click="grid.appScope.deleteTradeTargetPool(row.entity)"><a href="javascript:;" class="main_color">删除</a></span></div>'},
      ],
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
          $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
        });
      },
      enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    };

    //确认
    var isFirstClick = true;
    $scope.subPoolEdit = function () {
      if (isFirstClick) {
        isFirstClick = false;
        $scope.tempList.id = $scope.tmFund.id || '';
        $scope.tempList.note = $scope.tmFund.note?encodeURIComponent($scope.tmFund.note):'';
        $scope.tempList.tradeTarget = $scope.tmFund.tradeTarget || '';
        $scope.tempList.iwindcode = $scope.tmFund.iwindcode || '';
        if ($scope.tempList.id) {
          serverService.updateTradeCounterparty($scope.tempList).then(function () {
            $rootScope.errText = '修改成功';
            $rootScope.isError = true;
            $scope.tmFund = {};
            $scope.tempList = {};
            $scope.isEdit = false;
            getTradeTargetPool($rootScope.pageIndex, 17);
            isFirstClick = true;
          }, function (err) {
            isFirstClick = true;
            $scope.$emit('rejectError', err)
          });
        } else {
          serverService.addTradeTargetPool($scope.tempList).then(function () {
            $rootScope.errText = '创建成功';
            $rootScope.isError = true;
            $scope.tmFund = {};
            $scope.tempList = {};
            $scope.isEdit = false;
            getTradeTargetPool($rootScope.pageIndex, 17);
            isFirstClick = true;
          }, function (err) {
            isFirstClick = true;
            $scope.$emit('rejectError', err)
          });
        }
      }
    };
    //删除交易对手
    $scope.deleteTradeTargetPool = function (item) {
      $scope.$emit('chooseResult', {
        str: '确定删除该合约吗？',
        cb: function () {
          serverService.deleteTradeTargetPool(item.TargetId).then(function () {
            $rootScope.errText = '删除成功';
            $rootScope.isError = true;
            getTradeTargetPool($rootScope.pageIndex, 17);
          }, function (err) {
            $scope.$emit('rejectError', err)
          });
        }
      })
    };
    //事件通信
    $scope.$on("tmTraderCounterparty", function (event, data) {
      // 这里取到发送过来的数据 data
      getTradeTargetPool(data.pageIndex, 17);
    });
  }]);
});