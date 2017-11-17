define(['app', 'storage'], function (app, storage) {
  return app.controller('TMTradingDescriptionCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$interval', '$q', 'baseService', function ($scope, $rootScope, serverService, $cookies, $timeout, $interval, $q) {
    $rootScope.title = '交易管理';
    $rootScope.name = '日终交易说明';
    $rootScope.pageNow = 'tmTradingDescription';
    $rootScope.pageIndex = 1;
    $rootScope.isPagination = false;
    $scope.workday = new Date().Format('yyyy-MM-dd');
    function getWorkday() {
      serverService.getWorkDay($scope.workday, 1)
        .then(function (data) {
          $scope.t1 = data.workday;
        }, function (err) {
          $scope.$emit('rejectError', err);
        })
      serverService.getWorkDay($scope.workday, 2)
        .then(function (data) {
          $scope.t2 = data.workday;
        }, function (err) {
          $scope.$emit('rejectError', err);
        })
    }
    $scope.getManual = function () {
      showLoading();
      getWorkday();
      serverService.getManual($scope.workday)
        .then(function (data) {
          hideLoading();
          var count = 0;
          $scope.gridOptions.exporterCsvFilename = $scope.workday+'日终交易说明表.csv'
          data.forEach(function (i) {
            i.index = ++count;
            i.fundId += '';
          })
          $scope.gridOptions.data = data;
        }, function (err) {
          $scope.$emit('rejectError', err);
        })
    }
    $scope.getManual()
    //提交表单
    $scope.gridOptions = {
      enableGridMenu: true,
      enableSelectAll: true,
      exporterMenuPdf: false, // ADD THIS
      rowHeight: '42',
      rowEditWaitInterval: 200,
      exporterOlderExcelCompatibility: true,
      exporterCsvFilename: '日终交易说明表.csv',
      exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
      columnDefs: [
        { width: 50, headerCellClass: 'align_center',enableCellEdit: false, enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
        { width: 200, headerCellClass: 'align_center',enableCellEdit: false, enableColumnMenu: false, field: 'fundName',displayName: '产品名称', cellClass: 'align_center'},
        { width: 100, headerCellClass: 'align_center',enableCellEdit: false, enableColumnMenu: false, field: 'fundUserName',displayName: '产品负责人', cellClass: 'align_center'},
        { width: 150, headerCellClass: 'align_center',enableColumnMenu: false, field: 't1',displayName: 'T+1到期(万)', cellClass: 'number_type', type: 'number', cellFilter: 'number: 4'},
        { width: 150, headerCellClass: 'align_center',enableColumnMenu: false, field: 't2',displayName: 'T+2到期(万)', cellClass: 'number_type', type: 'number', cellFilter: 'number: 4'},
        { width: 150, headerCellClass: 'align_center',enableColumnMenu: false, field: 'cash',displayName: '资金头寸(万)', cellClass: 'number_type', type: 'number', cellFilter: 'number: 4'},
        { width: 150, headerCellClass: 'align_center',enableColumnMenu: false, field: 't0',displayName: '当日融出(万)', cellClass: 'number_type', type: 'number', cellFilter: 'number: 4'},
        { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'note',displayName: '备注说明', cellClass: 'align_center'},
        { width: 140, headerCellClass: 'align_center',enableCellEdit: false,enableColumnMenu: false, field: 'note',displayName: '操作', cellClass: 'main_color align_center',cellTemplate:'<div class="ui-grid-cell-contents main_color pointer"><span ng-click="grid.appScope.getWarning(row.entity)">获取到期</span><span style="margin-left: 10px" ng-click="grid.appScope.subEdit(row.entity)">保存</span></div>'},
      ],
      onRegisterApi: function (gridApi) {
        $scope.gridApi = gridApi;
        gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
          $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
        });
        gridApi.rowEdit.on.saveRow($scope, $scope.saveRow);
        /*gridApi.edit.on.afterCellEdit($scope,function(rowEntity, colDef, newValue, oldValue){
          if(newValue === oldValue){
            return;
          }
        });*/
      },
      enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
    };
    $scope.saveRow = function (rowEntity) {
      var promise = $q.defer();
      $scope.gridApi.rowEdit.setSavePromise( rowEntity, promise.promise );
      $interval(function () {
        promise.reject()
      }, 200)
    }
    //获取到期
    var tempRowEntity = {}
    $scope.getWarning = function (rowEntity) {
      var rowArr = []
      tempRowEntity = rowEntity;
      $scope.$emit('chooseResult', {
        str: '我们将以拿到的数据覆盖修改过的数据',
        cb: function () {
          showLoading();
          serverService.getWarningList('', '', tempRowEntity.fundId, $scope.t1, $scope.t2)
            .then(function (data) {
              hideLoading();
              if(data && data.length){
                data.forEach(function (i, index) {
                  if(i.amount === '--'){
                    i.amount = 0;
                  }
                  tempRowEntity['t'+[i.day]] = i.amount/10000;
                })
                rowArr.push(tempRowEntity)
                $scope.gridApi.rowEdit.setRowsDirty(rowArr);
              }
            })
        }
      });
    }
    //提交
    $scope.subEdit = function (rowEntity) {
      showLoading();
      var tempRow = []
      rowEntity.workdayShow = new Date(+rowEntity.workday).Format('yyyy-MM-dd');
      rowEntity.noteShow = encodeURIComponent(rowEntity.note);
      if(rowEntity.id){
        serverService.putManual(rowEntity)
          .then(function (data) {
            hideLoading();
            tempRow.push(rowEntity);
            $scope.gridApi.rowEdit.setRowsClean(tempRow)
          }, function (err) {
            $scope.$emit('rejectError', err);
            // promise.reject();
          })
      }else {
        serverService.PostManual(rowEntity)
          .then(function (data) {
            hideLoading();
            tempRow.push(rowEntity);
            $scope.gridApi.rowEdit.setRowsClean(tempRow)
            rowEntity.id = data.id;
          }, function (err) {
            $scope.$emit('rejectError', err);
            // promise.reject();
          })
      }
    }
  }])/*
    .filter('mapFund', ['$rootScope', 'serverService', '$timeout', function($rootScope, serverService, $timeout) {
      var fundNames = storage.local.getItem(storage.KEY.INITPARAMS.FUNDNAMES)
      var stateHash = {};
      fundNames.forEach(function (i) {
        stateHash[i.fundId] = i.fundName
      })
      return function(input) {
        if (!input){
          return '';
        } else {
          return stateHash[input];
        }
      };
    }]);*/
});