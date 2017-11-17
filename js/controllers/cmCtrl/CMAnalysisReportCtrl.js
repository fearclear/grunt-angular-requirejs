define(['app', 'storage'], function (app, storage) {
  return app.controller('CMAnalysisReportCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'FileUploader', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $location, FileUploader) {
      $rootScope.title = '信用管理';
      $rootScope.pageNow = 'cmAnalysisReport';
      $rootScope.pageIndex = 1;
      $rootScope.isPagination = true;
      $scope.searchForm = {}
      $scope.form = {}

      //文件上传模块
      var uploader = $scope.uploader = new FileUploader({
        url: storage.KEY.API.wordUrl+'/word/fileInfo',
        headers: {
          "x-basin-terminal": "PC",
          "x-basin-version": "1",
          "x-basin-token": storage.local.getItem(storage.KEY.USERINFO).userId,
        },
        autoUpload: false,
      });
      $scope.showUpload = function () {
        $scope.isUpload = true;
      }
      $scope.uploadItem = function (item) {
        if(!item.formData.length){
          item.formData.push({excuter: $rootScope.userInfo.userId+';'+$rootScope.userInfo.userName})
          var tradeid = $scope.form.tradeid||$scope.form.tradeBak.tradeid
          item.formData.push({tradeid: tradeid})
        }
        item.upload()
      }
      $scope.uploadAll = function () {
        uploader.uploadAll()
      }
      // FILTERS

      $scope.params = {
        tradeBak: [],
        trade: [],
        target: [],
        tag: [
          {
            id: '1',
            label: '任意关键字'
          },
          {
            id: '2',
            label: '两个及以上'
          },
          {
            id: '3',
            label: '全部关键字'
          },
        ]
      }
      //获取行业列表
      getTradeList()
      function getTradeList() {
        serverService.getTradeList()
          .then(function (data) {
            data.forEach(function (i) {
              i.SubTrade.unshift({
                tradeid: '',
                trade: '--',
              })
            })
            $scope.params.tradeBak = data
            $scope.params.trade = data[0].SubTrade || []
          })
      }
      //二级联动
      $scope.changeSelTrade2 = function (list) {
        $scope.params.trade = list
        $scope.form.tradeid = list.length?list[0].tradeid:''
      }
      // a sync filter
      uploader.filters.push({
        name: 'syncFilter',
        fn: function(item /*{File|FileLikeObject}*/, options) {
          if(!/(\.doc)|(\.docx)/i.test(item.name)){
            $rootScope.isError = true
            $rootScope.errText = '不支持的文件格式'
            return false
          }
          return this.queue.length < 10;
        },
      });
      uploader.onSuccessItem = function(fileItem, response, status, headers) {

      };
      uploader.onErrorItem = function(fileItem, response, status, headers) {
        console.log(response)
      };

      getFunctionGroup('trustworthiness')
      //获取指定组用户
      function getFunctionGroup(val) {
        showLoading()
        serverService.getFunctionGroup(val)
          .then(function (data) {
            var count = 0
            data.forEach(function (i) {
              i.index = ++count
              i.isQuitShow = i.isQuit === '0' ? '在职' : '离职';
            })
            $scope.delPutUsers = data;
          })
      }
      getFileInfo()
      $scope.getFileInfo = function (searchForm) {
        getFileInfo(searchForm)
      }
      function getFileInfo(params) {
        params = {
          pageIndex: params&&params.pageIndex?params.pageIndex:$rootScope.pageIndex,
          pageSize: params&&params.pageSize?params.pageSize:17,
          fileName: params&&params.fileName?params.fileName:'',
          fileDate: params&&params.fileDate?params.fileDate:null,
          excuter: params&&params.excuter?params.excuter:'',
        }
        if($scope.gridOptions){
          $scope.gridOptions.data = []
        }
        showLoading()
        serverService.getFileInfo(params)
          .then(function (doc) {
            var data = doc.listData
            var count = 0
            data.forEach(function (i) {
              i.index = ++count
              i.stateName = i.state===0?'待解析':i.state===1?'解析中':i.state===2?'完成':'解析失败'
              i.user = i.excuter.split(';')[1]
              if(i.OriginPath){
                i.OriginPath = storage.KEY.API.wordUrl+i.OriginPath
              }else {
                i.OriginPath = null
              }
              if(i.AnalyzedPath){
                i.AnalyzedPath = storage.KEY.API.wordUrl+i.AnalyzedPath
                i.isDone = true
              }else {
                i.AnalyzedPath = null
              }
            })
            $scope.gridOptions.data = data
            $rootScope.totalCount = doc.totalCount
          })
      }

      //上传文件
      $scope.showCtrl = function () {
        $scope.isEdit = true
        $scope.form.tradeBak=$scope.params.tradeBak.length?$scope.params.tradeBak[0]:{}
        var list = $scope.form.tradeBak.SubTrade
        $scope.params.trade = list
        $scope.form.tradeid = list.length?list[0].tradeid:''
      }
      $scope.cancelEdit =  function () {
        $scope.isEdit = false
        getFileInfo()
        uploader.clearQueue()
      }
      $scope.gridOptions = {
        enableGridMenu: false,
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        showTreeExpandNoChildren: false,
        rowHeight: '42',
        exporterOlderExcelCompatibility: true,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          { width: '50', headerCellClass: 'align_center',enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'filename',displayName: '文件名称', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'filetime',displayName: '上传时间', cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd HH:mm"'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'AnalyzeTime',displayName: '分析时间', cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd HH:mm"'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'stateName',displayName: '状态', cellClass: changeColor},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'user',displayName: '操作人', cellClass: 'align_center'},
          { width: '200', headerCellClass: 'align_center',enableColumnMenu: false, field: 'handle',displayName: '操作', cellClass: 'align_center',cellTemplate:'<div class="ui-grid-cell-contents"><a download="{{row.entity.OriginPath}}" target="_blank" href="{{row.entity.OriginPath}}" class="main_color pointer">原文件下载</a><a ng-show="{{row.entity.isDone}}" style="margin-left: 10px" download="{{row.entity.AnalyzedPath}}" target="_blank" href="{{row.entity.AnalyzedPath}}" class="main_color pointer">分析报告下载</a></div>'},
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
        if(row.entity.state===0){
          return 'color-gray align_center'
        }else if(row.entity.state===1){
          return 'main_color align_center'
        }else if(row.entity.state===2){
          return 'state_down align_center'
        }else {
          return 'state_up align_center'
        }
      }
      //事件通信
      $scope.$on("cmAnalysisReport", function (event, data) {
        // 这里取到发送过来的数据 data
        getFileInfo(data.pageIndex, 17);
      });
    }])
})