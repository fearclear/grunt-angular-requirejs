define(['app', 'storage'], function (app, storage) {
  return app.controller('TATreasuryTransactionsCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$location', 'baseService',
    function ($scope, $rootScope, serverService, $cookies, $timeout, $location) {
      $rootScope.pageNow = 'taTreasuryTransactions';
      $rootScope.pageIndex = 1;
      $rootScope.isPagination = true;
      $rootScope.title = '国债账户';
      $rootScope.name = '现货交易';
      $scope.fixNum = 4;
      $scope.rmForm = {}
      var paginationOptions = {
        pageNumber: 1,
        pageSize: 17,
        sort: null
      };
      $scope.params = {
        direction: [
          {
            code: '0',
            name: '全部',
          },
          {
            code: '1',
            name: '买入',
          },
          {
            code: '2',
            name: '卖出',
          },
        ]
      }
      $scope.gridOptions = {
        enableGridMenu: true,
        rowHeight: '42px',
        enableSelectAll: true,
        exporterMenuPdf: false, // ADD THIS
        exporterCsvFilename: '国债交易.csv',
        exporterOlderExcelCompatibility: true,
        enableRowHeaderSelection: false,
        exporterCsvLinkElement: angular.element(document.querySelectorAll(".custom-csv-link-location")),
        columnDefs: [
          { width: 50, enableColumnMenu: false, headerCellClass: 'align_center', field: 'index',displayName: '序号', cellClass: 'align_center'},
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'securityName',displayName: '债券名称',cellClass: 'align_center' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'iwindcode',displayName: 'wind代码',cellClass: 'align_center' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'workday',displayName: '交易日期',cellClass: 'align_center', cellFilter: 'date: "yyyy-MM-dd"' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'cnbdDate',displayName: '估值日期',cellClass: 'align_center' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'yieldRate',displayName: '实际收益',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'transPriceShow',displayName: '交易净价',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'fullPriceShow',displayName: '交易全价',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'directionShow',displayName: '交易方向',cellClass: changeDirectionColor },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'amountShow',displayName: '结算金额',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'volume',displayName: '数量',cellClass: 'number_type', cellFilter: 'number: 0' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'denominationShow',displayName: '面额(万元)',cellClass: 'number_type', cellFilter: 'number: 4' },
          { width: '**', enableColumnMenu: false, headerCellClass: 'align_center', field: 'profitShow',displayName: '平仓盈亏',cellClass: 'number_type', cellFilter: 'number: 4', cellTemplate: '<div class="ui-grid-cell-contents"><span ng-class="row.entity.profit>=0?\'state_up\':\'state_down\'">{{row.entity.direction===2?(row.entity.profit|number:2):"--"}}</span></div>' },
          { width: 100, enableColumnMenu: false, headerCellClass: 'align_center', field: 'handle',displayName: '操作', cellTemplate:'<div class="ui-grid-cell-contents main_color pointer align_center"><span><a href="javascript:;" class="main_color" ng-click="grid.appScope.showCtrl(row.entity)">查看</a></span></div>'},
        ],
        onRegisterApi: function( gridApi ){
          $scope.gridApi = gridApi;
          gridApi.core.on.columnVisibilityChanged( $scope, function( changedColumn ){
            $scope.columnChanged = { name: changedColumn.colDef.name, visible: changedColumn.colDef.visible };
          });
          gridApi.pagination.on.paginationChanged($scope, function (newPage, pageSize) {
            paginationOptions.pageNumber = newPage;
            $rootScope.pageIndex = newPage;
            paginationOptions.pageSize = pageSize;
          });
        },
        enablePaginationControls: false,
        paginationPageSize: 17,
        enableHorizontalScrollbar :  0, //grid水平滚动条是否显示, 0-不显示  1-显示
      };
      //状态样式
      function changeStateColor(grid, row) {
        if (row.entity.state === 1) {
          return 'tm_state_pass align_center'
        } else {
          return 'tm_state_normal align_center'
        }
      }
      function changeDirectionColor(grid, row) {
        if(row.entity.direction === 1){
          return 'state_up align_center'
        }else {
          return 'state_down align_center'
        }
      }
      function changeColor(grid, row) {
        if (row.entity.passRc) {
          return 'tm_state_pass_parent align_center'
        } else {
          return 'tm_state_error_parent align_center'
        }
      }
      $scope.rmFormS = {
        startDate: $rootScope.date.yesterDay,
        endDate: $rootScope.date.yesterDay,
        direction: '0',
      }
      var userInfo = storage.local.getItem(storage.KEY.USERINFO) || {}
      if(/trader/.test(userInfo.authority)){
        $scope.rmFormS.tradeUser = userInfo.userId
      }
      getOrder($rootScope.pageIndex, 17, $scope.rmFormS.iwindcode, $scope.rmFormS.startDate, $scope.rmFormS.endDate, $scope.rmFormS.direction)
      function getOrder(pageIndex, pageSize, iwindcode, startDate, endDate, direction) {
        showLoading()
        serverService.getNbOrder(1, 10000, iwindcode, startDate, endDate, direction)
          .then(function (doc) {
            var data = doc.listData
            hideLoading()
            var count = 0
            var item = {}
            var itemKey = storage.session.getItem(storage.KEY.NOTI);
            if(itemKey != 0){
              storage.session.setItem(storage.KEY.NOTI, 0)
            }
            data.forEach(function (i) {
              if(''+itemKey === ''+i.id){
                item = i
              }
              i.market = +i.market
              $scope.localMarkets.forEach(function (j) {
                if (i.market === j.id) {
                  i.marketName = j.label
                }
              })
              if (i.isFullPrice) {
                i.isFullPriceName = '否'
              } else {
                i.isFullPriceName = '是'
              }
              if (i.state) {
                i.stateShow = '关闭'
                i.stateName = '启用'
              } else {
                i.stateName = '停用'
                i.stateShow = '开启'
              }
              if (i.modifyTime) {
                i.modifyTimeShow = new Date(i.modifyTime).Format('yyyy-MM-dd HH:mm')
              }
              if (!i.sellFundName) {
                i.sellFundName = '外部产品'
              }
              if (!i.buyFundName) {
                i.buyFundName = '外部产品'
              }
              i.index = ++count
              i.transPriceShow = i.transPrice
              i.amountShow = i.amount
              i.fullPriceShow = i.fullPrice
              i.denominationShow = i.denomination / 10000
              i.tradeTypeShow = i.tradeType === '1' ? '一级' : i.tradeType === '2' ? '二级' : '其他'
              i.payOrganizationShow = i.payOrganization === 'buy' ? '买方' : '卖方'
              i.directionShow = i.direction === 1 ? '买入' : '卖出'
            })
            $scope.gridOptions.data = data
            if(itemKey != 0 && itemKey){
              $scope.showCtrl(item)
            }
            $rootScope.pageTotal = Math.ceil(doc.totalCount / 17) || 1;
            $rootScope.totalCount = doc.totalCount
            $rootScope.mainRatingCash.pageIndex = $rootScope.pageIndex = pageIndex;
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      $scope.$on('showModal', function () {
        getOrder($rootScope.pageIndex, 17, $scope.rmFormS.iwindcode, $scope.rmFormS.startDate, $scope.rmFormS.endDate, $scope.rmFormS.direction)
      })
      //
      $scope.isShowCompare = false;
      $scope.compareList = [];
      $scope.compareWorkday = $rootScope.date.yesterDay;
      $scope.cancelCompare = function () {
        $scope.isShowCompare = false;
        $scope.compareList = [];
      }
      $scope.getNbComparison = function () {
        $scope.isShowCompare = true;
        serverService.getNbComparison($scope.compareWorkday)
          .then(function (data) {
            $scope.compareList = data
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      //配置国债郑虎
      $scope.nbInfo = {}
      $scope.updateNbInfo = function () {
        serverService.getNbInfo()
          .then(function (data) {
            $scope.isShowInfo = true;
            $scope.nbInfo = {
              amount: data.initAmount,
              profit: data.initProfit,
            }
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      $scope.updateShowInfo = function () {
        serverService.updateNbInfo($scope.nbInfo)
          .then(function (data) {
            $rootScope.isError = true;
            $rootScope.errText = '修改成功';
            $scope.isShowInfo = false;
          }, function (err) {
            $scope.$emit('rejectError', err);
          })
      }
      //查询预警信息
      function getRcHis(item) {
        serverService.getRcHistory(item.rcVersion)
          .then(function (data) {
            item.detailList = data
            if (data && data.length) {
              data.forEach(function (i) {
                item.title = i.ruleId + ':' + i.desc + '\n'
              })
            }
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }

      $scope.showDetailList = function (item) {
        if (item.passRcShow === '预警') {
          $scope.items = item.detailList
          $scope.isShowMoreList = true
        }
      }
      //搜索功能
      $scope.searchMain = function () {
        getOrder($rootScope.pageIndex, 17, $scope.rmFormS.iwindcode, $scope.rmFormS.startDate, $scope.rmFormS.endDate, $scope.rmFormS.direction)
      }
      //修改保留位数
      $scope.changeFixNum = function () {
        if($scope.realRate==='1'){
          $scope.getAsideContent()
        }else if($scope.realRate==='2'){
          $scope.getAsideContent('transPrice')
        }else {
          $scope.getAsideContent('fullPrice')
        }
        if($scope.rmForm.market===2){
          $scope.fixNum = 3;
        }else {
          $scope.fixNum = 4;
        }
        $scope.getFullAmount()
      }
      //aside详情
      $scope.asideData = {}
      $scope.getAsideContent = function (str) {
        $scope.asideData = {}
        if(($scope.rmForm.realRate==='1' && str==='transPrice') || ($scope.rmForm.yieldRate === undefined && $scope.rmForm.realRate==='1') || ($scope.rmForm.transPrice === undefined && $scope.rmForm.realRate==='2') || ($scope.rmForm.fullPrice === undefined && $scope.rmForm.realRate==='3')){
          return
        }
        if($scope.rmForm.bondName && $scope.rmForm.bondName.securityName && $scope.rmForm.iwindcode && $scope.rmForm.clearDay && $scope.rmForm.cnbdDate){
          showLoading()
          //这里传递的clearDay, 在service中转义为workday, 实际使用的是清算日期
          serverService.getSecurityInfo($scope.rmForm.bondName.securityName, $scope.rmForm.iwindcode, $scope.rmForm.clearDay, $scope.rmForm.cnbdDate, +$scope.rmForm.yieldRate||0, +$scope.rmForm.transPrice||0, +$scope.rmForm.realRate, +$scope.rmForm.fullPrice||0)
            .then(function (data) {
              hideLoading()
              if(data){
                $scope.asideData = data
                if($scope.firstUpdate){
                  $scope.firstUpdate = false
                }else {
                  if($scope.rmForm.realRate === '1'){
                    $scope.rmForm.transPrice = (+data.actual_calc_price).toFixed($scope.fixNum)
                  }else if($scope.rmForm.realRate === '2'){
                    $scope.rmForm.yieldRate = (+data.actualProfitRate).toFixed($scope.fixNum)
                  }else if($scope.rmForm.realRate === '3'){
                    $scope.rmForm.yieldRate = (+data.actualProfitRate).toFixed($scope.fixNum)
                    $scope.rmForm.transPrice = (+data.actual_calc_price).toFixed($scope.fixNum)
                  }
                  $scope.getFullAmount()
                }
                /*
                $scope.asideData.key = true
                $('.rm-addNew-main').css({
                  float: 'left'
                })*/
              }else{/*
                $('.rm-addNew-main').css({
                  float: 'none'
                })*/
              }
            }, function (err) {
              hideLoading()
              $scope.$emit('rejectError',err)
            })
        }
      }
      $scope.delOrder = function (item) {
        $scope.$emit('chooseResult', {
          str: '确定删除该指令吗？',
          cb: function () {
            item.state = 2
            serverService.updateOrderState(item)
              .then(function () {
                $rootScope.errText = '删除成功';
                $rootScope.isError = true;
                getOrder($rootScope.pageIndex, 17, $scope.rmFormS.iwindcode, $scope.rmFormS.startDate, $scope.rmFormS.endDate, $scope.rmFormS.direction)
              }, function (err) {
                $scope.$emit('rejectError', err)
              })
          }
        })
      }
      $scope.addCtrl = function () {
        $scope.iwindcodePlace = ''
        $scope.asideData = {}
        $scope.bond = {}
        $scope.state = 0
        $scope.isEdit = true
        $scope.isUpdate = false
        $scope.isFuzzySearch = false;
        $scope.isFuzzySearchCounter = false;
        $scope.isFuzzySearchCounterTrade = false;
        $scope.bondType = $scope.bondTypes[0]
        $scope.rmForm = {
          title: '指令下单',
          confirm: '确认',
          bondType: '利率债',
          securityType: '国债',
          fullPrice: '',
          market: 1,
          tradeType: '3',
          payOrganization: 'buy',
          isFullPrice: '1',
          clearSpeed: '0',
          realRate: '1',
          direction: '1',
        }
      }
      $scope.updateCtrl = function (item) {
        $scope.iwindcodePlace = ''
        $scope.asideData = {}
        $scope.bond = {}
        $scope.chooseSecurityNameTicket(item)
        $scope.isEdit = true
        $scope.isUpdate = true
        $scope.state = item.state
        $scope.firstUpdate = true
        $scope.rmForm = {
          title: '指令下单修改',
          confirm: '修改',
          bondName: {
            securityId: item.securityId,
            securityName: item.securityName
          },
          workday: new Date(item.workday).Format('yyyy-MM-dd'),
          buyFundId: item.buyFundId + '',
          sellFundId: item.sellFundId + '',
          market: item.market,
          bondNumber: item.volume,
          iwindcode: item.iwindcode,
          yieldRate: +item.yieldRate,
          cnbdDate: item.cnbdDate,
          transPrice: item.transPriceShow,
          amount: item.amountShow,
          fullPrice: item.fullPriceShow,
          denomination: item.denominationShow,
          state: item.state,
          desc: item.desc,
          counterParty: item.counterParty,
          counterpartyId: item.counterpartyId,
          tempCounterparty: item.transferAgentName,
          protocolNumber: item.protocolNumber,
          tempTradeCounterparty: item.counterpartyName,
          transferAgentId: item.transferAgentId,
          id: item.id,
          isFullPrice: item.isFullPrice,
          transferFee: item.transferFee,
          payOrganization: item.payOrganization,
          transferUser: item.transferUser,
          clearSpeed: item.clearSpeed,
          tradeUser: item.tradeUser,
          tradeType: item.tradeType,
          realRate: JSON.parse(item.extra).realRate||'1',
          clearDay: JSON.parse(item.extra).clearDay||'',
        }
        if(!item.clearDay){
          $scope.selDate(new Date(item.workday).Format('yyyy-MM-dd'))
        }
        $scope.getBlack(1)
        $scope.getBlack(2)
        for (var i = 0; i < $scope.bondTypes.length; i++) {
          for (var j = 0; j < $scope.bondTypes[i].list.length; j++) {
            if (item.securityType == $scope.bondTypes[i].list[j].id) {
              $scope.bondType = $scope.bondTypes[i]
              $scope.rmForm.bondType = $scope.bondTypes[i].id
              $scope.rmForm.securityType = item.securityType
              break
            }
          }
        }
      }
      $scope.taskForm = {}
      $scope.showCtrl = function (item) {
        $scope.isEditShow = true
        $scope.state = item.state
        $scope.taskForm = {
          title: '指令下单修改',
          confirm: '修改',
          bondName: {
            securityId: item.securityId,
            securityName: item.securityName
          },
          workday: new Date(item.workday).Format('yyyy-MM-dd'),
          buyFundId: item.buyFundId + '',
          buyFundName: item.buyFundName,
          sellFundId: item.sellFundId + '',
          sellFundName: item.sellFundName,
          market: item.market,
          marketName: item.marketName,
          bondNumber: item.volume,
          transPrice: item.transPriceShow,
          amount: item.amountShow,
          fullPrice: item.fullPriceShow,
          profit: item.profit,
          denomination: item.denominationShow,
          state: item.state,
          desc: item.desc,
          directionShow: item.directionShow,
          counterParty: item.counterParty,
          counterPartyName: item.transferAgentName,
          counterPartyTradeName: item.counterpartyName,
          protocolNumber: item.protocolNumber,
          id: item.id,
          cnbdDate: item.cnbdDate,
          yieldRate: +item.yieldRate,
          iwindcode: item.iwindcode,
          isFullPrice: item.isFullPrice,
          isFullPriceName: item.isFullPriceName,
          transferFee: item.transferFee,
          payOrganization: item.payOrganization,
          payOrganizationShow: item.payOrganizationShow,
          transferUser: item.transferUser,
          transferUserName: item.transferUserName,
          clearSpeed: item.clearSpeed,
          tradeUser: item.tradeUser,
          tradeUserName: item.tradeUserName,
          tradeType: item.tradeType,
          tradeTypeShow: item.tradeTypeShow,
          extra: JSON.parse(item.extra),
          buyBlacks: '',
          sellBlacks: '',
        }
        $scope.rmForm = {
          bondName: {
            securityId: item.securityId,
            securityName: item.securityName
          },
          iwindcode: item.iwindcode,
          cnbdDate: item.cnbdDate,
          workday: new Date(+item.workday).Format('yyyy-MM-dd'),
          yieldRate: item.yieldRate,
          realRate: $scope.taskForm.extra.realRate,
          clearDay: $scope.taskForm.extra.clearDay,
          transPrice: $scope.taskForm.transPrice,
          fullPrice: $scope.taskForm.fullPrice,
          clearSpeed: $scope.taskForm.clearSpeed,
        }
        if(!$scope.rmForm.clearDay){
          serverService.getWorkDay($scope.rmForm.workday, $scope.rmForm.clearSpeed)
            .then(function (data) {
              $scope.rmForm.clearDay = data.workday;
              $scope.getAsideContent()
            }, function (err) {
              $scope.$emit('rejectError', err)
            })
        }
        $scope.getAsideContent();
        for (var i = 0; i < $scope.bondTypes.length; i++) {
          for (var j = 0; j < $scope.bondTypes[i].list.length; j++) {
            if (item.securityType == $scope.bondTypes[i].list[j].id) {
              $scope.bondType = $scope.bondTypes[i]
              $scope.taskForm.bondType = $scope.bondTypes[i].id
              $scope.taskForm.securityType = item.securityType
              break
            }
          }
        }
        var buyBlacks = $scope.taskForm.extra.buyBlacks
        var sellBlacks = $scope.taskForm.extra.sellBlacks
        getBlacks('buyBlacks', buyBlacks)
        getBlacks('sellBlacks', sellBlacks)
        function getBlacks(str, item) {
          item.forEach(function (i) {
            $scope.taskForm[str]+=i.title+';\n'
          })
        }
        $scope.bond = {
          available: $scope.taskForm.extra.available,
          holding: $scope.taskForm.extra.holding,
        }
      }
      $scope.cancelEdit = function () {
        $scope.isEdit = false
        $scope.isEditShow = false
        $scope.isShowInfo = false;
      }
      //停用规则
      $scope.changeStateCtrl = function (item) {
        $scope.$emit('chooseResult', {
          str: '确定' + item.stateName + '该指令吗？',
          cb: function () {
            if (item.state) {
              item.state = 0
            } else {
              item.state = 1
            }
            showLoading()
            serverService.updateOrderState(item)
              .then(function () {
                hideLoading()
                $rootScope.errText = item.stateName + '成功';
                $rootScope.isError = true;
                getOrder($rootScope.pageIndex, 17, $scope.rmFormS.iwindcode, $scope.rmFormS.startDate, $scope.rmFormS.endDate, $scope.rmFormS.direction)
              }, function (err) {
                $scope.$emit('rejectError', err)
              })
          }
        })
      }
      var firstClick = true
      $scope.subEdit = function () {
        if (!$scope.rmForm.workday) {
          showErrTip('交易日期不合法')
          return
        }
        if (+$scope.rmForm.fullPrice === +$scope.rmForm.transPrice) {
          showErrTip('交易净价和全价不能相等')
          return
        }
        var formData = {}
        var goNext = true
        formData.id = $scope.rmForm.id || ''
        formData.workday = $scope.rmForm.workday || ''
        formData.buyFundId = $scope.rmForm.buyFundId || 0
        formData.sellFundId = $scope.rmForm.sellFundId || 0
        formData.market = $scope.rmForm.market || '0'
        formData.direction = $scope.rmForm.direction || '1'
        formData.yieldRate = +$scope.rmForm.yieldRate || 0
        formData.cnbdDate = $scope.rmForm.cnbdDate || ''
        formData.iwindcode = $scope.rmForm.iwindcode || ''
        formData.protocolNumber = $scope.rmForm.protocolNumber || ''
        formData.securityType = $scope.rmForm.securityType || ''
        formData.volume = $scope.rmForm.bondNumber || 0
        formData.transPrice = $scope.rmForm.transPrice || 0
        formData.amount = $scope.rmForm.amount || 0
        formData.isFullPrice = $scope.rmForm.isFullPrice
        formData.denomination = $scope.rmForm.denomination * 10000 || 0
        formData.counterParty = $scope.rmForm.counterpartyId || ''
        formData.counterpartyId = $scope.rmForm.counterpartyId || 0
        formData.state = $scope.state
        formData.tradeType = $scope.rmForm.tradeType || '3'
        formData.transferFee = $scope.rmForm.transferFee || 0
        formData.fullPrice = $scope.rmForm.fullPrice || 0
        formData.transferUser = $scope.rmForm.transferUser || ''
        formData.transferAgentId = $scope.rmForm.transferAgentId || 0
        formData.tradeUser = $scope.rmForm.tradeUser || ''
        formData.clearSpeed = $scope.rmForm.clearSpeed || 0
        formData.payOrganization = $scope.rmForm.payOrganization || 'buy'
        formData.desc = $scope.rmForm.desc ? encodeURIComponent($scope.rmForm.desc) : ''
        if(!$scope.rmForm.tempCounterparty){
          formData.transferAgentId = 0;
        }
        if(!$scope.rmForm.tempTradeCounterparty){
          formData.counterpartyId = 0;
        }
        var extra = {
          sellBlacks: $scope.sellBlacks,
          buyBlacks: $scope.buyBlacks,
          available: $scope.bond.available,
          holding: $scope.bond.holding,
          realRate: $scope.rmForm.realRate,
          clearDay: $scope.rmForm.clearDay,
        }
        formData.extra = encodeURIComponent(JSON.stringify(extra))
        if ($scope.rmForm.bondName) {
          formData.securityId = $scope.rmForm.bondName.securityId || ''
        }else if (!formData.workday) {
          showErrTip('交易日期不合法')
        }
        function showErrTip(str) {
          $rootScope.isError = true
          $rootScope.errText = str
          goNext = false
        }
        var directionName = formData.direction === '1' ? '买入' : '卖出';
        $scope.$emit('chooseResult', {
          str: '确认'+directionName+'该债券吗？',
          cb: function () {
            showLoading()
            if (firstClick && goNext) {
              firstClick = false
              if (formData.id) {
                serverService.updateOrder(formData)
                  .then(function (data) {
                    firstClick = true
                    $scope.isEdit = false
                    getOrder($rootScope.pageIndex, 17, $scope.rmFormS.iwindcode, $scope.rmFormS.startDate, $scope.rmFormS.endDate, $scope.rmFormS.direction)
                  }, function (err) {
                    firstClick = true
                    $scope.$emit('rejectError', err)
                  })
              } else {
                serverService.addNbOrder(formData)
                  .then(function (data) {
                    hideLoading()
                    firstClick = true
                    $scope.isEdit = false
                    getOrder($rootScope.pageIndex, 17, $scope.rmFormS.iwindcode, $scope.rmFormS.startDate, $scope.rmFormS.endDate, $scope.rmFormS.direction)
                  }, function (err) {
                    firstClick = true
                    $scope.$emit('rejectError', err)
                  })
              }
            }
          }
        })
      }
      //查看提示
      function showTip(data) {

      }

      $scope.cancelShowMore = function () {
        $scope.isShowMoreList = false
        $scope.items = []
      }
      //计算结算金额
      $scope.getFullAmount = function () {
        if($scope.rmForm.transPrice){
          $scope.rmForm.fullPrice = ((+$scope.rmForm.transPrice||0)+(+$scope.asideData.calc_accrint||0)).toFixed($scope.fixNum)
        }
        if($scope.rmForm.bondNumber){
          $scope.rmForm.amount = $scope.rmForm.fullPrice * $scope.rmForm.bondNumber
          $scope.rmForm.denomination = $scope.rmForm.bondNumber / 100;
        }
      }
      //日期控制
      $scope.selDate = function (date) {
        if (!date) {
          return false
        }
        var selDate = new Date(date.replace('-', '/')).getTime();
        var nowDate = new Date()
        nowDate.setHours(0, 0, 0, 0)
        nowDate = nowDate.getTime()
        // if (selDate < nowDate) {
        //   $rootScope.isError = true
        //   $rootScope.errText = '不能选择今天之前的日期'
        //   return false
        // } else {
          serverService.getWorkDay($scope.rmForm.workday, $scope.rmForm.clearSpeed)
            .then(function (data) {
              $scope.rmForm.clearDay = data.workday;
              $scope.getAsideContent()
            }, function (err) {
              $scope.$emit('rejectError', err)
            })
        // }
      }
      //切换债券类型
      $scope.changeBondType = function (item) {
        $scope.bondTypes.forEach(function (i) {
          if (i.id === item) {
            $scope.bondType = i
          }
        })
        $scope.rmForm.securityType = $scope.bondType.list[0].id
      }
      //债券简称
      var tempFuzzySearchArr = [];
      $scope.isFuzzySearch = false;
      $scope.fuzzySearchSecurityName = function (fundId, value) {
        $scope.rmForm.iwindcode = ''
        tempFuzzySearchArr.push(value);
        if (!value) {
          $scope.isFuzzySearch = false;
        } else {
          $scope.isFuzzySearch = true;
        }
        serverService.fuzzyIwindcode(value)
          .then(function (data) {
            if (data.key != tempFuzzySearchArr[tempFuzzySearchArr.length - 1]) {
              return;
            }
            $scope.securityNames = data.result;
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      //模糊搜索
      $scope.chooseSecurityNameTicket = function (item) {
        $scope.rmForm.bondName = item;
        $scope.rmForm.iwindcode = item.iwindcode;
        $scope.getAsideContent()
        $scope.isFuzzySearch = false;
      }
      var tmOwnTempArr = [];
      //交易对手联动
      var fuzzyList = {
        1: 'isFuzzySearchCounter',
        2: 'isFuzzySearchCounterTrade'
      }
      $scope.getTradeCounterparty = function (flag, value) {
        if (!value) {
          $scope[fuzzyList[flag]] = false;
        } else {
          $scope[fuzzyList[flag]] = true;
        }
        tmOwnTempArr.push(value)
        serverService.getTradeCounterparty(1, 10, flag, value)
          .then(function (data) {
            if (data.key != tmOwnTempArr[tmOwnTempArr.length - 1]) {
              return;
            }
            if(flag === 1){
              $scope.counterpartyList = data.result.listData;
            }else {
              var tempArr = []
              $rootScope.fundNamesNormal.forEach(function (i) {
                if(new RegExp(value).test(i.fundName)){
                  tempArr.push({
                    id: i.fundId,
                    title: i.fundName,
                  })
                }
              })
              $scope.counterpartyTradeList = data.result.listData.concat(tempArr);
            }
            tmOwnTempArr = []
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
      }
      $scope.chooseCounterparty = function (item) {
        $scope.rmForm.tempCounterparty = item.title;
        $scope.rmForm.transferAgentId = item.id;
        $scope.isFuzzySearchCounter = false;
      }
      $scope.chooseCounterpartyTrade = function (item) {
        $scope.rmForm.tempTradeCounterparty = item.title;
        $scope.rmForm.counterpartyId = item.id;
        $scope.isFuzzySearchCounterTrade = false;
      }
      $scope.closeTip = function () {
        $scope.isShowTip = false
        $scope.tipTitle = ''
        $scope.tipText = ''
      }
      //查询黑名单
      $scope.sellBlacks = $scope.buyBlacks = []
      $scope.bond = {}/*
      $scope.getBlack = function (flag) {
        if(!$scope.rmForm.bondName || !$scope.rmForm.bondName.securityId){
          return
        }
        if($scope.rmForm.sellFundId){
          $scope.localFund.forEach(function (i) {
            if(i.fundId === $scope.rmForm.sellFundId){
              $scope.sellFundName = i.fundName
            }
          })
        }else {
          $scope.sellFundName = ''
        }
        var fundId = flag === 1? $scope.rmForm.sellFundId : $scope.rmForm.buyFundId
        switch (flag){
          case 1:
            $scope.sellBlacks = []
            break
          case 2:
            $scope.buyBlacks = []
            break
          default:
            break
        }
        serverService.getBlack($scope.rmForm.bondName.securityId, fundId, flag)
          .then(function (data) {
            if(flag === 1 && data){
              $scope.sellBlacks = data
            }else if(data){
              $scope.buyBlacks = data
            }
          }, function (err) {
            $scope.$emit('rejectError', err)
          })
        if($scope.rmForm.bondName.securityId && $scope.rmForm.sellFundId){
          serverService.getBondAvailable($scope.rmForm.sellFundId, 1, 10, $scope.rmForm.bondName.securityId)
            .then(function (data) {
              $scope.bond = data.list[0] || {}
            }, function (err) {
              $scope.$emit('rejectError', err)
            })
        }
      }*/
      $scope.getBlack = function () {
        
      }
      //参数
      $scope.bondTypes = [
        {
          id: '利率债',
          label: '利率债',
          list: [
            {id: '国债', label: '国债', group: '利率债'},
            {id: '地方政府债', label: '地方政府债', group: '利率债'},
            {id: '央行票据', label: '央行票据', group: '利率债'},
            {id: '金融债', label: '金融债', group: '利率债'},
            {id: '同业存单', label: '同业存单', group: '利率债'},
          ]
        },
        {
          id: '信用债',
          label: '信用债',
          list: [
            {id: '企业债', label: '企业债', group: '信用债'},
            {id: '公司债', label: '公司债', group: '信用债'},
            {id: '中期票据', label: '中期票据', group: '信用债'},
            {id: '短期融资', label: '短期融资', group: '信用债'},
            {id: '超短融', label: '超短融', group: '信用债'},
          ]
        },
        {
          id: '非公开',
          label: '非公开',
          list: [
            {id: '非公开定向', label: '非公开定向', group: '非公开'},
            {id: '中小型私募', label: '中小型私募', group: '非公开'},
            {id: '资产支持证券(ABS)', label: '资产支持证券(ABS)', group: '非公开'},
            {id: '资产支持票据(ABN)', label: '资产支持票据(ABN)', group: '非公开'},
          ]
        },
        {
          id: '现金',
          label: '现金',
          list: [
            {id: '货币市场基金', label: '货币市场基金', group: '现金'},
            {id: '大额存单', label: '大额存单', group: '现金'},
            {id: '协议存单', label: '协议存单', group: '现金'},
            {id: '证券回购', label: '证券回购', group: '现金'},
          ]
        },
        {
          id: '股票基金期货',
          label: '股票基金期货',
          list: [
            {id: '股票股票型基金', label: '股票股票型基金', group: '股票基金期货'},
            {id: '混合型基金', label: '混合型基金', group: '股票基金期货'},
            {id: '分级基金进取型', label: '分级基金进取型', group: '股票基金期货'},
            {id: '估值期货', label: '估值期货', group: '股票基金期货'},
            {id: '国债期货', label: '国债期货', group: '股票基金期货'},
            {id: '权证', label: '权证', group: '股票基金期货'},
          ]
        },
      ]
      $scope.ratings = [
        {id: 'A-', label: 'A-'},
        {id: 'A', label: 'A'},
        {id: 'A+', label: 'A+'},
        {id: 'AA-', label: 'AA-'},
        {id: 'AA', label: 'AA'},
        {id: 'AA+', label: 'AA+'},
        {id: 'AAA-', label: 'AAA-'},
        {id: 'AAA', label: 'AAA'},
        {id: 'AAA+', label: 'AAA+'},
        {id: '其他评级', label: '其他评级'},
      ]
      $scope.localMarkets = [
        {id: 1, label: '银行间'},
        {id: 2, label: '交易所'},
        {id: 3, label: '中证报价'},
      ]
      $scope.tradeTypes = [
        {id: '1', label: '一级交易'},
        {id: '2', label: '二级交易'},
        {id: '3', label: '其他'},
      ]
      $scope.localFund = getFundIds()
      function getFundIds() {
        var fundIds = []
        if ($rootScope.fundNamesNormal) {
          fundIds = $rootScope.fundNamesNormal.slice()
          fundIds.push({
            fundId: '0',
            fundName: '外部产品'
          })
          storage.session.setItem(storage.KEY.RISKMANAGEMENT.FUNDIDS, fundIds)
          return fundIds
        } else {
          fundIds = storage.session.getItem(storage.KEY.RISKMANAGEMENT.FUNDIDS)
          return fundIds
        }
      }

      //事件通信
      $scope.$on("taTreasuryTransactions", function (event, data) {
        // 这里取到发送过来的数据 data
        $scope.gridApi.pagination.seek(+data.pageIndex)
      });
    }])
})