define(['app'], function (app) {
  return app.controller('TAAccountSettingCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', 'baseService', function ($scope, $rootScope, serverService, $cookies, $timeout) {
    $rootScope.title = '国债账户';
    $rootScope.name = '期货账户配置';
    $rootScope.pageNow = 'taAccountSetting';
    $rootScope.pageIndex = 1;
    $scope.taForm = {};
    $rootScope.isPagination = false
    getNbfAccount();
    function getNbfAccount() {
      showLoading();
      serverService.getNbfAccount().then(function (data) {
        hideLoading();
        var count = 0
        data.forEach(function (i) {
          i.index = ++count
          i.stateName = i.State === 0 ? '正常' : '停用';
          i.templateName = i.TemplateId === 1 ? 'A' : 'B';
          i.TemplateId += '';
        })
        $scope.gridOptions2.data = data;
        $rootScope.nbAccounts = data;
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
          $scope.taForm = {
            State: '0',
            TemplateId: '1',
            name: '新增期货账户',
            confirm: '确认',
          };
          break;
        case 'edit':
          $scope.isUpdate = true;
          $scope.taForm.name = '期货账户修改';
          $scope.taForm.confirm = '修改';
          $scope.taForm.AccountName = update.AccountName;
          $scope.taForm.CreateDate = new Date(update.CreateDate).Format('yyyy-MM-dd');
          $scope.taForm.State = update.State;
          $scope.taForm.TemplateId = update.TemplateId;
          $scope.taForm.AccountNo = update.AccountNo;
          $scope.taForm.AccountId = update.AccountId;
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
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'AccountName',displayName: '账户名', cellClass: 'align_center'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'CreateDate',displayName: '创建时间', cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd"'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'stateName',displayName: '状态', cellClass: changeColor},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'templateName',displayName: '模板类型', cellClass: 'align_center'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'AccountNo',displayName: '账户号', cellClass: 'align_center'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'handle',displayName: '操作', cellClass: 'main_color align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer"><span ng-click="grid.appScope.showEdit(\'edit\', row.entity)"><a href="javascript:;" class="main_color">修改</a></span><span style="margin-left: 10px" ng-click="grid.appScope.deleteNbfAccount(row.entity)"><a href="javascript:;" class="main_color">删除</a></span></div>'},
      ],
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
          $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
        });
      },
      enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    };
    function changeColor(grid, row) {
      if(row.entity.State === 0){
        return 'align_center state_down';
      }else {
        return 'align_center state_up';
      }
    }
    //确认
    var isFirstClick = true;
    $scope.subEdit = function () {
      if (isFirstClick) {
        isFirstClick = false;
        $scope.tempList.AccountName = $scope.taForm.AccountName || '';
        $scope.tempList.CreateDate = $scope.taForm.CreateDate
        $scope.tempList.State = $scope.taForm.State;
        $scope.tempList.TemplateId = $scope.taForm.TemplateId || '';
        $scope.tempList.AccountNo = $scope.taForm.AccountNo || '';
        $scope.tempList.AccountId = $scope.taForm.AccountId || '';
        if ($scope.tempList.AccountId) {
          serverService.updateNbfAccount($scope.tempList).then(function () {
            $rootScope.errText = '修改成功';
            $rootScope.isError = true;
            $scope.taForm = {};
            $scope.tempList = {};
            $scope.isEdit = false;
            getNbfAccount();
            isFirstClick = true;
          }, function (err) {
            isFirstClick = true;
            $scope.$emit('rejectError', err)
          });
        } else {
          serverService.createNBfAccount($scope.tempList).then(function () {
            $rootScope.errText = '创建成功';
            $rootScope.isError = true;
            $scope.taForm = {};
            $scope.tempList = {};
            $scope.isEdit = false;
            getNbfAccount();
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
    $scope.deleteNbfAccount = function (item) {
      $scope.$emit('chooseResult', {
        str: '确定删除该账户吗？',
        cb: function () {
          serverService.deleteNbfAccount(item.AccountId).then(function () {
            $rootScope.errText = '删除成功';
            $rootScope.isError = true;
            getNbfAccount();
          }, function (err) {
            $scope.$emit('rejectError', err)
          });
        }
      })
    };
    //参数
    $scope.params =  {
      template: [
        {
          id: '1',
          value: 'A',
        },
        {
          id: '2',
          value: 'B',
        },
      ]
    }
    //事件通信
    $scope.$on("tmTraderCounterparty", function (event, data) {
      // 这里取到发送过来的数据 data
      getNbfAccount();
    });
  }]);
});