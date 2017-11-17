'use strict';

define(['app', 'storage'], function (app, storage) {
  return app.controller('TMTradeImportCtrl', ['$scope', '$rootScope', 'serverService', 'FileUploader', '$timeout', 'baseService',
    function ($scope, $rootScope, serverService, FileUploader, $timeout) {
      $rootScope.title = '交易管理';
      $rootScope.name = '国债期货交易导入';
      $rootScope.pageNow = 'tmTradeImport';
      $rootScope.pageIndex = 1;
      $scope.tmFund = {};
      $rootScope.isPagination = false;
      $scope.fileName = '选择文件'

      //上传国债期货交易
      var uploader = $scope.uploader = new FileUploader({
        url: storage.KEY.API.url+'/nb/dailytrade',
        headers: {
          "x-basin-terminal": "PC",
          "x-basin-version": "1",
          "x-basin-token": storage.local.getItem(storage.KEY.USERINFO).userId,
        },
        data: {
          valuedate: 1,
          accountid: 1,
        },
      });
      getTradeCounterparty();
      function getTradeCounterparty(pageIndex, pageSize ,type , keyword) {
        $rootScope.pageIndex = pageIndex;
        showLoading();
        serverService.getTradeCounterparty(pageIndex, pageSize, type, keyword).then(function (doc) {
          hideLoading();
          var data = doc.result
          var count = 0
          data.listData.forEach(function (i) {
            i.index = ++count
          })
          $scope.gridOptions.data = data.listData;
          $rootScope.pageTotal = Math.ceil(data.totalCount / 17);
          $rootScope.totalCount = data.totalCount;
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
            $scope.tmFund.name = '新增交易对手';
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
      $scope.gridOptions = {
        enableGridMenu: false,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        rowHeight: '42',
        exporterOlderExcelCompatibility: true,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          { width: 50, headerCellClass: 'align_center',enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'title',displayName: '交易对手名称', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'contact',displayName: '联系人', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'phone',displayName: '手机号码', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'qq',displayName: 'QQ', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'handle',displayName: '操作', cellClass: 'main_color align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer"><span ng-click="grid.appScope.showEdit(\'edit\', row.entity)"><a href="javascript:;" class="main_color">编辑</a></span><span style="margin-left: 10px" ng-click="grid.appScope.deleteCounterparty(row.entity)"><a href="javascript:;" class="main_color">删除</a></span></div>'},
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
      $scope.subEdit = function () {
        if (isFirstClick) {
          isFirstClick = false;
          $scope.tempList.id = $scope.tmFund.id || '';
          $scope.tempList.title = $scope.tmFund.title?encodeURIComponent($scope.tmFund.title):'';
          $scope.tempList.qq = $scope.tmFund.qq || '';
          $scope.tempList.contact = $scope.tmFund.contact?encodeURIComponent($scope.tmFund.contact):'';
          $scope.tempList.phone = $scope.tmFund.phone || '';
          $scope.tempList.type = 2;
          if ($scope.tempList.id) {
            serverService.updateTradeCounterparty($scope.tempList).then(function () {
              $rootScope.errText = '修改成功';
              $rootScope.isError = true;
              $scope.tmFund = {};
              $scope.tempList = {};
              $scope.isEdit = false;
              getTradeCounterparty($rootScope.pageIndex, 17, 2);
              isFirstClick = true;
            }, function (err) {
              isFirstClick = true;
              $scope.$emit('rejectError', err)
            });
          } else {
            serverService.addTradeCounterparty($scope.tempList).then(function () {
              $rootScope.errText = '创建成功';
              $rootScope.isError = true;
              $scope.tmFund = {};
              $scope.tempList = {};
              $scope.isEdit = false;
              getTradeCounterparty($rootScope.pageIndex, 17, 2);
              isFirstClick = true;
            }, function (err) {
              isFirstClick = true;
              $scope.$emit('rejectError', err)
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
      //删除交易对手
      $scope.deleteCounterparty = function (item) {
        $scope.$emit('chooseResult', {
          str: '确定删除该交易对手吗？',
          cb: function () {
            serverService.deleteTradeCounterparty(item.id).then(function () {
              $rootScope.errText = '删除成功';
              $rootScope.isError = true;
              getTradeCounterparty($rootScope.pageIndex, 17, 2);
            }, function (err) {
              $scope.$emit('rejectError', err)
            });
          }
        })
      };
      //事件通信
      $scope.$on("tmTraderCounterparty", function (event, data) {
        // 这里取到发送过来的数据 data
        getTradeCounterparty(data.pageIndex, 17, 2);
      });
  }]);
});