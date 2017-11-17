define(['app', 'storage'], function (app, storage) {
  return app.controller('TADayOffCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', 'FileUploader', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $timeout, FileUploader) {
      $rootScope.pageNow = 'taDayOff';
      $rootScope.pageIndex = 1;
      $rootScope.isPagination = false;
      $rootScope.title = '国债账户';
      $rootScope.name = '期货清算';
      $scope.isMain = true;
      $scope.workday = $rootScope.date.yesterDay
      $scope.taForm = {};
      $scope.tabNow = 0;
      getValueDate()
      function getValueDate() {
        serverService.getNbfValuedate()
          .then(function (data) {
            $scope.valueDate = new Date(data.ValueDate).Format('yyyy-MM-dd');
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      $scope.updateNbfValuedate = function () {
        showLoading();
        serverService.updateNbfValuedate($scope.workday)
          .then(function (data) {
            hideLoading();
            $rootScope.isError = true;
            $rootScope.errText = '获取行情成功';
            getValueDate()
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      $scope.refreshTab = function (flag) {
        $scope.tabNow = flag;
        if($scope.tabNow === 0){
          $rootScope.isPagination = false;
        }else if($scope.tabNow === 1){
          $rootScope.isPagination = true;
          showLoading();
          serverService.getClear($rootScope.pageIndex, 17, 'all')
            .then(function (data) {
              hideLoading();
              var count = 0
              data.listData.forEach(function (i) {
                i.index = ++count;
                i.stateName = i.State === 0 ? '正在清算' : i.State === 1 ? '清算完成' : '清算失败'
              })
              $scope.gridOptions.data = data.listData;
              $rootScope.pageIndex = data.PageIndex;
              $rootScope.totalCount = data.TotalCount;
              $rootScope.pageTotal = data.TotalPage;
            }, function (err) {
              $scope.$emit('rejectError', err);
            })
        }else if($scope.tabNow === 2){
          $rootScope.isPagination = false;
        }
      }
      $scope.headInfo = {};
      $scope.tabs = [
        {
          index: 0,
          value: '日终操作',
        },
        {
          index: 1,
          value: '清算记录',
        },
        {
          index: 2,
          value: '投资合约池',
        }
      ]
      $scope.gridOptions = {
        enableGridMenu: false,
        rowHeight: '42px',
        rowEditWaitInterval: 200,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        exporterOlderExcelCompatibility: true,
        enableRowHeaderSelection: false,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          { width: 50, enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'index',displayName: '序号', cellClass: 'align_center'},
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'AccountName',displayName: '账户名称',cellClass: 'align_center' },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'ValueDate',displayName: '最近清算日期',cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd"'  },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'CalcTime',displayName: '操作时间',cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd HH:mm:ss"'  },
          { width: '**', enableCellEdit: false, enableColumnMenu: false, headerCellClass: 'align_center', field: 'stateName',displayName: '结果',cellClass: changeColor },
        ],
        onRegisterApi: function( gridApi ){
          $scope.gridApi = gridApi;
        },
        enablePaginationControls: false,
        enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      function changeColor(grid, row, col) {
        if(row.entity.State === 0){
          return 'align_center main_color';
        }else if(row.entity.State === 1){
          return 'align_center state_down';
        }else if(row.entity.State === 2 || !row.entity.State){
          return 'align_center state_up';
        }
      }
      $scope.cancelEdit = function (str) {
        $scope[str] = false;
        uploader.clearQueue()
        var file = $(":file");
        file.val('');
        $scope.isEdit = false;
        $scope.fmFund = {};
        $scope.tempList = {};
      }
      //提示
      $scope.confirmSub = function () {
        $scope.$emit('chooseResult', {
          str: '确认清算'+$scope.workday+'的数据吗？',
          cb: function () {
            $scope.subEdit();
          }
        })
      }
      $scope.subEdit = function () {
        var accountIdList = '';
        $scope.clearList.forEach(function (i) {
          if(i.select){
            accountIdList += i.AccountId + ','
          }
        })
        accountIdList = accountIdList.split('');
        accountIdList.pop();
        accountIdList = accountIdList.join('');
        showLoading()
        serverService.startClear(accountIdList, $scope.workday)
          .then(function () {
            hideLoading()
            $rootScope.isError = true;
            $rootScope.errText = '清算完成';
            $scope.isShowList = false;
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      //判断日期
      $scope.changeClick = function (item) {
        if(new Date($scope.workday.replace(/-/g,'/')).getTime()<new Date(item.ValueDate).getTime()){
          $rootScope.isError = true;
          $rootScope.errText = '清算日期不能小于最近清算日期';
          item.select = false;
        }
      }
      //查看行情
      $scope.getQuote = function () {
        serverService.getQuote()
          .then(function (data) {
            data.listData.sort(function (a, b) {
              if(a.ValueDate>b.ValueDate){
                return -1;
              }else {
                return 1;
              }
            })
            $scope.items = data.listData;
            $scope.isShowQuote = true;
          })
      }
      //导入明细
      $scope.showImportModal = function () {
        $scope.isShowImport = true;
      }
      //调用清算列表
      $scope.showImportList = function () {
        showLoading();
        serverService.getClear()
          .then(function (data) {
            hideLoading();
            data.forEach(function (i) {
              i.select = false;
            })
            $scope.clearList = data;
            $scope.isShowList = true;
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      //文件上传
      var uploader = $scope.uploader = new FileUploader({
        url: storage.KEY.API.url+'/nbf/import',
        headers: {
          "x-basin-terminal": "PC",
          "x-basin-version": "1",
          "x-basin-token": storage.local.getItem(storage.KEY.USERINFO).userId,
        },
        method: 'POST',
      });
      $scope.showUpload = function () {
        $scope.isUpload = true;
      }
      $scope.upload = function () {
        if(!$scope.taForm.accountId || !$scope.taForm.valueDate){
          $rootScope.isError = true;
          $rootScope.errText = '请输入模板ID或日期时间'
        }else {
          uploader.uploadAll()
        }
      }
      // FILTERS

      // a sync filter
      uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          uploader.clearQueue();
          if(!/\.(xlsx)$/i.test(item.name)){
            $rootScope.isError = true;
            $rootScope.errText = '只接受Excel2007以上版本xlsx格式';
            return false;
          }
          return this.queue.length < 10;
        },
      });

      // CALLBACKS
      uploader.onBeforeUploadItem = function (fileItem) {
        fileItem.formData.push({accountId: $scope.taForm.accountId})
        fileItem.formData.push ({valueDate: $scope.taForm.valueDate})
      }
      uploader.onSuccessItem = function(fileItem, response, status, headers) {
        $rootScope.isError = true;
        $rootScope.errText = '上传成功';
        uploader.clearQueue()
        var file = $(":file");
        file.val('');
        $scope.cancelEdit('isShowImport');
      };
      uploader.onErrorItem = function(fileItem, response, status, headers) {
        uploader.clearQueue()
        var file = $(":file");
        file.val('');
        $scope.$emit('rejectError', response);
      };
      //事件通信
      $scope.$on("taDayOff", function (event, data) {
        // 这里取到发送过来的数据 data
        $scope.refreshTab(1);
      });
    }])
})