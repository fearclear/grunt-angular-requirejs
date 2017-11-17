define(['app'], function (app) {
  return app.controller('CMAnalysisConfigCtrl',['$scope', '$rootScope', 'serverService', '$cookies', '$location', 'FileUploader', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $location, FileUploader) {
      $rootScope.title = '信用管理';
      $rootScope.pageNow = 'cmAnalysisConfig';
      $rootScope.pageIndex = 1;
      $rootScope.isPagination = false;
      $scope.form = {}
      $scope.tradeList = []
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
      getWordMatch()
      function getWordMatch(params) {
        showLoading()
        params = {
          pageIndex: params&&params.pageIndex?params.pageIndex:$rootScope.pageIndex,
          pageSize: 10000,
        }
        serverService.getWordMatch(params)
          .then(function (doc) {
            hideLoading()
            var data = doc?doc.listData:[]
            var count = 0
            if (data && data.length) {
              data.forEach(function (i) {
                i.$$treeLevel = i.level
                if(i.level === 1){
                  i.tag = i.target = i.reg1 = i.reg2 = i.reg3 = null
                }
                i.index = ++count
                i.regName = (i.reg1?i.reg1:'') + (i.reg2 ? '|' : '') + (i.reg2?i.reg2:'') + (i.reg3 ? '|' : '') + (i.reg3?i.reg3:'')
                $scope.params.tag.forEach(function (t) {
                  if (t.id === i.tag) {
                    i.tagName = t.label
                  }
                })
              })
            }
            $scope.gridOptions.data = data
          })
      }
      //获取定向指标
      getWordTarget()
      function getWordTarget() {
        serverService.getWordTarget()
          .then(function (data) {
            $scope.params.target = data
            $scope.form.targetid = data.length?data[0].targetid:''
          })
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
          { width: 50, headerCellClass: 'align_center',enableColumnMenu: false, field: 'index',displayName: '序号', cellClass: 'align_center', type: 'number'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'target',displayName: '定向指标', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'regName',displayName: '关键字', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'tagName',displayName: '匹配规则', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'trade',displayName: '行业', cellClass: 'align_center'},
          { width: '**', headerCellClass: 'align_center',enableColumnMenu: false, field: 'handle',displayName: '操作', cellClass: changeVisible,cellTemplate:'<div class="ui-grid-cell-contents"><span class="main_color pointer" ng-click="grid.appScope.showTradeRelate(row.entity)">分配行业</span><span style="margin-left: 10px" class="main_color pointer" ng-click="grid.appScope.showCtrl(\'update\', row.entity)">修改</span><span style="margin-left: 10px" class="tm_state_pass pointer" ng-click="grid.appScope.deleteWordMatch(row.entity)">删除</span></div>'},
        ],
        rowTemplate: "<div ng-dblclick=\"grid.appScope.showInfo(row)\" ng-repeat=\"(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name\" class=\"ui-grid-cell\" ng-class=\"{ 'ui-grid-row-header-cell': col.isRowHeader }\" ui-grid-cell></div>",
        onRegisterApi: function (gridApi) {
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged($scope, function (changedColumn) {
            $scope.columnChanged = {name: changedColumn.colDef.name, visible: changedColumn.colDef.visible};
          });
        },
        enableHorizontalScrollbar: 0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      $scope.showInfo = function (row) {
        $scope.gridApi.treeBase.toggleRowTreeState(row);
      }
      function changeVisible(grid, row, col) {
        if(row.entity.$$treeLevel){
          return 'hide-model-wrap'
        }else {
          return 'align_center'
        }
      }
      //创建配置文件
      $scope.showCtrl = function (flag, item) {
        $scope.isEdit = true
        switch (flag){
          case 'add':
            $scope.form = {
              tag: '1',
              title: '新增配置',
              targetid: $scope.params.target.length?$scope.params.target[0].targetid:'',
              confirm: '确认',
              flag: 'add',
            }
            break
          case 'update':
            $scope.form = item
            $scope.form.title = '修改配置'
            $scope.form.confirm = '修改'
            $scope.form.flag = 'update'
            break
          default:
            break
        }
      }
      //分配行业
      $scope.showTradeRelate = function (item) {
        $scope.isShowTradeRelate = true
        $scope.form = item
        $scope.form.tradeBak=$scope.params.tradeBak.length?$scope.params.tradeBak[0]:{}
        var list = $scope.form.tradeBak.SubTrade
        $scope.params.trade = list
        $scope.form.tradeid = list.length?list[0].tradeid:''
        var params = {
          pageIndex: 1,
          pageSize: 10000,
          mid: item.mid
        }
        showLoading()
        serverService.getWordMatch(params)
          .then(function (doc) {
            var data = doc.listData
            data.forEach(function (i) {
              if(i.level === 1){
                $scope.params.tradeBak.forEach(function (t) {
                  if(i.tradeid === t.tradeid || i.fatherid === t.tradeid){
                    i.tradeOne = t.trade
                  }
                })
              }
            })
            var list = []
            data.forEach(function (i) {
              if(i.level === 1){
                list.push(i)
              }
            })
            $scope.tradeList = list
          })
      }
      //分配行业
      $scope.addTradeRelate = function (form) {
        var data = {
          mid: form.mid,
          tradeid: form.tradeid||form.tradeBak.tradeid
        }
        serverService.addTradeRelate(data)
          .then(function (data) {
            getWordMatch()
            $scope.showTradeRelate(form)
          })
      }
      //删除行业
      $scope.deleteTradeRelate = function (item) {
        var params = {
          id: item.id
        }
        serverService.deleteTradeRelate(params)
          .then(function () {
            getWordMatch()
            $scope.showTradeRelate(item)
          })
      }
      //subEdit
      var firstClick = true
      $scope.subEdit = function () {
        if(firstClick){
          firstClick = false
          var data = $.extend({}, $scope.form)
          switch (data.flag){
            case 'add':
              break
            case 'update':
              break
            default:
              break
          }
          if(!(data.reg1||data.reg2||data.reg3)){
            showErrTip('至少选择一个关键字')
            return
          }
          if(!data.targetid){
            showErrTip('请选择定向指标')
            return
          }
          if(!data.tag){
            showErrTip('请选择匹配规则')
            return
          }
          if(data.mid){
            serverService.updateWordMatch(data)
              .then(function (data) {
                showErrTip('修改成功')
                $scope.cancelEdit()
                getWordMatch()
              }, function (err) {
                firstClick = true
              })
          }else {
            serverService.addWordMatch(data)
              .then(function (data) {
                showErrTip('创建成功')
                $scope.cancelEdit()
                getWordMatch()
              }, function (err) {
                firstClick = true
              })
          }
        }
      }
      function showErrTip(str) {
        $rootScope.isError = true
        $rootScope.errText = str
        firstClick = true
      }
      //deleteMatch
      $scope.deleteWordMatch = function (item) {
        serverService.deleteWordMatch({mid: item.mid})
          .then(function () {
            showErrTip('删除成功')
            getWordMatch()
          })
      }
      //cancelEdit
      $scope.cancelEdit = function () {
        $scope.isEdit = false
        $scope.isShowTradeRelate = false
      }
      //事件通信
      $scope.$on("cmAnalysisConfig", function (event, data) {
        // 这里取到发送过来的数据 data
        getProducts(data.pageIndex, 17);
      });
    }])
})