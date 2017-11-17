define(['app', 'storage'], function (app, storage) {
  return app.controller('TMOwnCtrl', ['$scope', '$rootScope', 'serverService', '$cookies', '$timeout', '$location', 'baseService', function ($scope, $rootScope, serverService, $cookies, $timeout, $location) {
    $rootScope.title = '交易管理';
    $rootScope.pageNow = 'tmOwn';
    $rootScope.name = '我的下单'
    $rootScope.pageIndex = 1;
    $rootScope.isPagination = false;
    $scope.tempList = {};
    $scope.tmFundS = {};
    $scope.tmFund = {};
    $scope.isEdit = {
      isTicket: false,
      isBuyBackZY: false,
      isBuyBackMD: false,
      isTrading: false,
      isBuySell: false,
      isExchange: false
    }
    $scope.showMoreList = {
      isTicket: false,
      isBuyBack: false,
      isBuySell: false,
      isTrading: false
    };
    var timer = $timeout(function () {
      $scope.tmFundS.startTime = $rootScope.date.yesterDay;
      $scope.tmFundS.endTime = $rootScope.date.today;
    }, 200);
    $scope.$on('$destroy', function () {
      $timeout.cancel(timer);
    });
    getOwnTransaction({
      startTime: $rootScope.date.yesterDay,
      endTime: $rootScope.date.today,
    })

    function getOwnTransaction(params) {
      params = params || {}
      params = {
        pageIndex: params.pageIndex || $rootScope.pageIndex,
        pageSize: 10000,
        keyWord: params.keyWord || '',
        businessType: params.businessType || $scope.tmFundS.businessType,
        startTime: params.startTime || $scope.tmFundS.startTime,
        endTime: params.endTime || $scope.tmFundS.endTime,
        traderId: params.traderId || $scope.tmFundS.traderName,
        businessDirection: params.businessDirection || $scope.tmFundS.direction,
        state: params.state || $scope.tmFundS.businessState,
        fundId: params.fundId || $scope.tmFundS.fundName,
        entryIntoForceTime: params.entryIntoForceTime || '',
        liquidationSpeed: params.liquidationSpeed || $scope.tmFundS.liquidationSpeed,
      }
      $('.tmTicket_addNew_wrap').css({
        transition: 'none'
      })
      $rootScope.pageIndex = params.pageIndex || 1;
      $scope.tmOwnTotalPrice = 0;
      showLoading();
      serverService.getOwnTransaction(params).then(function (data) {
        hideLoading();
        $scope.items = data.listData;
        $scope.items.forEach(function (i) {
          if((((i.businessTypeCode === '2' || i.businessTypeCode === '3') && new Date(i.buyBackClosingDate.replace(/-/g, '/')).getTime()>new Date().getTime())||i.state === '待确认') && i.state !== '已撤销'){
            i.editable = true
          }
          i.amount = +i.amount;
          i.bondNameMoreLists = [];
          i.isChecked = false;
          if(new Date(i.createTime.replace(/-/g, '/')).getTime()<new Date().setHours(0, 0, 0, 0)){
            i.oldBusiness = true
          }
          if (i.businessTypeCode == '2' || i.businessTypeCode == '3') {
            switch (i.businessDirectionCode) {
              case '3':
              case '7':
                $scope.tmOwnTotalPrice += +i.transPrice;
                break;
              default:
                $scope.tmOwnTotalPrice -= +i.transPrice;
                break;
            }
            if (i.bondName.indexOf('[') != -1) {
              var length = JSON.parse(i.bondName).length;
              i.bondNameUpdateLists = [];
              i.bondNameMoreListsStr = '';
              for (var t = 0; t < length; t++) {
                //分号显示
                if (t == length - 1) {
                  i.bondNameShow += '' + JSON.parse(i.bondName)[t].securityName;
                  i.bondNumberShow += '' + JSON.parse(i.bondName)[t].volume;
                } else {
                  i.bondNameShow += '' + JSON.parse(i.bondName)[t].securityName + ';';
                  i.bondNumberShow += '' + JSON.parse(i.bondName)[t].volume + ';';
                }
                i.bondNameUpdateLists.push({
                  securityName: JSON.parse(i.bondName)[t].securityName,
                  securityId: JSON.parse(i.bondName)[t].securityId,
                  available: JSON.parse(i.bondName)[t].volume,
                  proport: JSON.parse(i.bondName)[t].proport
                })
                //列表显示
                i.bondNameMoreLists.push({
                  securityName: JSON.parse(i.bondName)[t].securityName,
                  securityId: JSON.parse(i.bondName)[t].securityId,
                  volume: JSON.parse(i.bondName)[t].volume,
                  proport: JSON.parse(i.bondName)[t].proport
                })
                i.bondNameMoreListsStr += '[ ' + JSON.parse(i.bondName)[t].securityName + ', ' + JSON.parse(i.bondName)[t].securityId + ', ' + JSON.parse(i.bondName)[t].volume + ', ' + JSON.parse(i.bondName)[t].proport + ' ]\n'
              }
              if (i.bondNameShow) {
                i.bondNameShow = i.bondNameShow.replace('undefined', '');
              }
              if (i.bondNumberShow) {
                i.bondNumberShow = i.bondNumberShow.replace('undefined', '');
              }
            }
          } else {
            if (i.bondName != 'undefined' && i.businessTypeCode != '5') {
              i.bondNameShow = JSON.parse(i.bondName).securityName;
            }
            switch (i.businessDirectionCode) {
              case '2':
              case '5':
                $scope.tmOwnTotalPrice += +i.amount;
                break;
              default:
                $scope.tmOwnTotalPrice -= +i.amount;
                break;
            }
          }
        })
        $rootScope.pageTotal = Math.ceil(data.totalCount / 10000);
        $rootScope.totalCount = data.totalCount;
      }, function (err) {
        $scope.$emit('rejectError', err)
      });
    }

    $scope.reset = function () {
      $scope.tmFundS = {
        startTime: $rootScope.date.yesterDay,
        endTime: $rootScope.date.today
      };
      $scope.tmAllBusinessType = {};
    };
    //查询
    $scope.search = function () {
      $scope.tmFundS.businessType = '';
      for (i in $scope.tmAllBusinessType) {
        if (i && $scope.tmAllBusinessType[i]) {
          $scope.tmFundS.businessType += $scope.tmAllBusinessType[i] + ';'
        }
      }
      getOwnTransaction()
    };
    //查看更多
    $scope.showMore = function (item) {
      $scope.tempTicket = item;
      switch (item.businessTypeCode) {
        case '1':
          $scope.showMoreList.isTicket = true;
          break;
        case '2':
        case '3':
          $scope.showMoreList.isBuyBack = true;
          break;
        case '4':
          $scope.showMoreList.isTrading = true;
          break;
        case '5':
          $scope.showMoreList.isBuySell = true;
          break;
        default:
          break;
      }
    };

    //头寸查询
    $scope.bondAvailables = [];
    $scope.getBondAvailable = function (fundId, fund) {
      getBondAvailable(fundId);
      $scope.tempFundLists = [];
      $scope.bondNameTempLists = [];
    };

    function getBondAvailable(fundId, callback) {
      serverService.getBondAvailable(fundId, 1, 10000)
        .then(function (data) {
          $scope.bondAvailables = data.list;
          if (callback) {
            callback();
          }
        }, function (err) {
          $scope.$emit('rejectError', err)
        });
    }

    $scope.tempFundLists = [];
    $scope.appendTemp = function (item) {
      for (var i = 0; i < $scope.tempFundLists.length; i++) {
        if (item.securityId == $scope.tempFundLists[i].securityId) {
          return;
        }
      }
      var tempItem = {
        securityName: item.securityName,
        securityId: item.securityId,
        available: item.available,
        proport: 100
      }
      $scope.tempFundLists.push(tempItem);
      $scope.getAmount();
    };
    $scope.deleteBondList = function (index) {
      if($scope.tmFund && $scope.tmFund.changeBuyBackDate===true){
        return
      }
      $scope.tempFundLists.splice(index, 1);
    };
    //添加新债
    $scope.addOneList = function () {
      $scope.tempFundLists.push({
        securityName: '',
        securityId: '',
        available: '',
        proport: '',
      })
    }
    //检测融资融券变化
    $scope.$watch('tmFund.businessDirection', function (nv, ov) {
      if ((nv == 4 || nv == 8) && $scope.tempFundLists.length == 0) {
        $scope.tempFundLists = [{
          securityName: '',
          securityId: '',
          available: '',
          proport: ''
        }]
      } else if ((nv == 3 || nv == 7) && $scope.tempFundLists.length == 0) {
        $scope.tempFundLists = []
      }
    })
    //工作日检查
    $scope.checkWorkday = function () {
      if (!$scope.tmFund.buyBackClosingDate) {
        return;
      }
      serverService.getWorkDay($scope.tmFund.buyBackClosingDate, 0)
        .then(function (data) {
          if (data.from != data.workday) {
            $scope.$emit('chooseResult', {
              str: '所选日期为非工作日，是否顺延至工作日？',
              cb: function () {
                $scope.tmFund.buyBackClosingDate = data.workday;
                $scope.tmFund.realDate = data.interval;
              }
            })
          }
        }, function (err) {
          $scope.$emit('rejectError', err)
        });
    }
    $scope.chooseWorkday = function () {
      if ($scope.tmFund.buyBackDay && $scope.tmFund.startTime) {
        serverService.getWorkDay($scope.tmFund.startTime, $scope.tmFund.buyBackDay)
          .then(function (data) {
            $scope.tmFund.buyBackClosingDate = data.workday;
            $scope.tmFund.realDate = data.interval;
          }, function (err) {
            $scope.$emit('rejectError', err)
          });
      }
    }
    var tmOwnTempArr = [];
    //交易对手联动
    /*
    以下
     */
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
          if (flag === 1) {
            $scope.counterpartyList = data.result.listData;
          } else {
            var tempArr = []
            $rootScope.fundNamesNormal.forEach(function (i) {
              if (new RegExp(value).test(i.fundName)) {
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
    $scope.chooseCounterpartyTicket = function (item) {
      $scope.tmFund.transferAgentName = item.title;
      $scope.tmFund.transferAgentId = item.id;
      $scope.isFuzzySearchCounter = false;
    }
    $scope.chooseCounterpartyTrade = function (item) {
      $scope.tmFund.tradeCounterpartyName = item.title;
      $scope.tmFund.tradeCounterpartyId = item.id;
      $scope.isFuzzySearchCounterTrade = false;
    }
    /*
    以上
     */
    $scope.getCounterparty = function (value) {
      if (!value) {
        $scope.isFuzzySearchCounter = false;
      } else {
        $scope.isFuzzySearchCounter = true;
      }
      tmOwnTempArr.push(value)
      serverService.getCounterpartyGroup('', value)
        .then(function (data) {
          if (data.key != tmOwnTempArr[tmOwnTempArr.length - 1]) {
            return;
          }
          $scope.counterpartyList = data.result;
          tmOwnTempArr = []
        }, function (err) {
          $scope.$emit('rejectError', err)
        })
    }
    //linkman选择
    $scope.selectLinkMan = function () {
      for (var i = 0; i < $scope.counterpartyList.length; i++) {
        if ($scope.counterpartyList[i].counterpartyId === $scope.tmFund.counterparty) {
          $scope.tmFund.counterpartyUserName = $scope.counterpartyList[i].linkman;
        }
      }
    };
    var tempFuzzySearchArr = [];
    $scope.isFuzzySearch = false;
    $scope.fuzzySearchSecurityName = function (fundId, value) {
      tempFuzzySearchArr.push(value);
      if (!value) {
        $scope.isFuzzySearch = false;
      } else {
        $scope.isFuzzySearch = true;
      }
      serverService.fuzzySearch(0, value)
        .then(function (data) {
          if (data.key != tempFuzzySearchArr[tempFuzzySearchArr.length - 1]) {
            return;
          }
          $scope.securityNames = data.result;
          tempFuzzySearchArr = [];
        }, function (err) {
          $scope.$emit('rejectError', err)
        })
    }
    //模糊搜索
    $scope.chooseSecurityNameTicket = function (item) {
      if($scope.tmFund && $scope.tmFund.changeBuyBackDate){
        return
      }
      $scope.tmFund.bondName = item;
      $scope.isFuzzySearch = false;
    }
    //模糊搜索
    $scope.fuzzySearch = function (flag, item) {
      var keyword = '';
      switch (flag) {
        case 'id':
          keyword = item.securityId;
          item.isFuzzySearchCode = true;
          break;
        case 'name':
          keyword = item.securityName;
          item.isFuzzySearchId = true;
          break;
        default:
          break;
      }
      serverService.fuzzySearch(0, keyword)
        .then(function (data) {
          $scope.securityNames = data.result;
        }, function (err) {
          $scope.$emit('rejectError', err)
        })

    }
    $scope.hideFuzzySearch = function (flag, item) {
      var timer2 = $timeout(function () {
        item[flag] = false;
      }, 200)
      $scope.$on('$destroy', function () {
        $timeout.cancel(timer2);
      });
    }
    $scope.chooseSecurityName = function (item, result) {
      item.securityId = result.securityId;
      item.securityName = result.securityName;
    }
    //取消查看
    $scope.cancelShowMore = function (str) {
      $scope.tempTicket = {};
      $scope.showMoreList[str] = false;
      $scope.tempFundLists = [];
      $scope.bondAvailables = []
      $scope.tmFund = {};
    }
    //选中全部
    $scope.isCheckedAll = function (checkedAll) {
      if (checkedAll) {
        $scope.items.forEach(function (i) {
          i.isChecked = true;
        })
      } else {
        $scope.items.forEach(function (i) {
          i.isChecked = false;
        })
      }
    }
    //检查全选状态
    $scope.checkChecked = function () {
      var flag = false;
      for (var i = 0; i < $scope.items.length; i++) {
        if ($scope.items[i].isChecked == false) {
          $scope.checkedAll = false;
          return;
        }
      }
      $scope.checkedAll = true;
    }
    //新建
    $scope.showAddNew = function () {
      $scope.isShowAddNew = !$scope.isShowAddNew;
    }
    $scope.ownAddNew = function (flag) {
      $('.tmTicket_addNew_wrap').css({
        transition: '0.3s'
      })
      $scope.isShowNumberTypeAmount = false;
      $scope.isShowNumberTypeTransPrice = true;
      switch (flag) {
        case 1:
          $scope.isEdit.isTicket = true;
          $scope.tmFund = {
            businessDirection: 1,
            payOrganization: 'buy',
            fullPrice: 'yes',
            traderName: $cookies.get('userId'),
            liquidationSpeed: 0,
            market: '0',
            title: '新建现券下单',
            businessType: '1'
          };
          break;
        case 2:
          $scope.isEdit.isBuyBackZY = true;
          $scope.tmFund = {
            startTime: new Date().Format('yyyy-MM-dd'),
            businessDirection: 3,
            liquidationSpeed: 0,
            traderName: $cookies.get('userId'),
            market: '0',
            serviceType: '1',
            title: '新建质押式回购',
            businessType: '2'
          };
          break;
        case 3:
          $scope.isEdit.isBuyBackMD = true;
          $scope.tmFund = {
            startTime: new Date().Format('yyyy-MM-dd'),
            businessDirection: 7,
            liquidationSpeed: 0,
            traderName: $cookies.get('userId'),
            market: '0',
            serviceType: '1',
            title: '新建买断式回购',
            businessType: '3'
          };
          break;
        case 4:
          $scope.isEdit.isTrading = true;
          $scope.tmFund = {
            traderName: $cookies.get('userId'),
            fullPrice: 'yes',
            market: '0',
            businessType: '4',
            title: '新建一级交易'
          };
          break;
        case 5:
          $scope.isEdit.isBuySell = true;
          $scope.tmFund = {
            businessType: '5',
            title: '新建申购赎回',
            businessDirection: 5,
            traderName: $cookies.get('userId')
          };
          break;
        case 6:
          $scope.isEdit.isExchange = true;
          $scope.tmFund = {
            startTime: new Date().Format('yyyy-MM-dd'),
            businessDirection: 3,
            liquidationSpeed: 0,
            traderName: $cookies.get('userId'),
            market: '1',
            serviceType: '1',
            title: '新建交易所回购',
            businessType: '2'
          };
          break;
        default:
          break;
      }
      $scope.tmFund.confirm = '确认';
      $scope.isShowAddNew = false;
    }
    //修改与确认
    $scope.update = function (update) {
      if(update.businessTypeCode === '2' || update.businessTypeCode === '3'){
        if((((update.businessTypeCode === '2' || update.businessTypeCode === '3') && new Date(update.buyBackClosingDate.replace(/-/g, '/')).getTime()>new Date().getTime())||update.state === '待确认') && update.state !== '已撤销'){
          $scope.tmFund.changeBuyBackDate = true
        }else {
          return
        }
      }else if (update.state != '待确认' && update.businessTypeCode !== '2' && update.businessTypeCode !== '3') {
        return;
      }
      if(update.state === '待确认'){
        $scope.tmFund.changeBuyBackDate = false
      }
      $scope.isShowNumberTypeAmount = false;
      $scope.isShowNumberTypeTransPrice = true;
      $scope.isUpdate = true;
      $scope.tmFund.confirm = '修改';
      $scope.tmFund.businessDirection = update.businessDirectionCode;
      $scope.tmFund.businessId = update.businessId;
      $scope.tmFund.amount = update.amount / 1;
      $scope.tmFund.fundName = update.fundId;
      $scope.tmFund.transferAgentId = update.transferAgentId;
      $scope.tmFund.capitalUserId = update.capitalUserId;
      $scope.tmFund.tradeCounterpartyId = update.tradeCounterpartyId;
      $scope.tmFund.tradeCounterpartyName = update.tradeCounterpartyName;
      $scope.tmFund.transferAgentName = update.transferAgentName;
      $scope.tmFund.protocolNumber = update.protocolNumber;
      $scope.tmFund.traderName = update.traderId;
      $scope.tmFund.market = update.marketCode;
      $scope.tmFund.counterparty = update.counterpartyId;
      $scope.tmFund.buyOrganization = update.buyOrganization;
      $scope.tmFund.bondHeadName = update.bondHeadId;
      $scope.tmFund.counterpartyType = update.marketCode;
      $scope.tmFund.fullAmount = update.fullAmount / 1;
      $scope.tmFund.sellOrganization = update.sellOrganization;
      $scope.tmFund.bondProportion = update.bondProportion / 1;
      $scope.tmFund.transPrice = update.transPrice / 1;
      $scope.tmFund.payOrganization = update.payOrganizationCode;
      $scope.tmFund.fullPrice = update.fullPriceCode;
      $scope.tmFund.denomination = update.denomination / 10000;
      $scope.tmFund.liquidationSpeed = update.liquidationSpeedCode;
      $scope.tmFund.bondNumber = update.bondNumber / 1;
      $scope.tmFund.traderName = update.traderId;
      $scope.tmFund.counterpartyUserName = update.counterpartyUserName;
      $scope.tmFund.buyBackDay = update.buyBackDay;
      $scope.tmFund.startTime = update.startTime;
      $scope.tmFund.buyBackClosingDate = update.buyBackClosingDate;
      $scope.tmFund.interestRate = update.interestRate / 1;
      $scope.tmFund.serviceType = update.serviceTypeCode;
      $scope.tempFundLists = update.bondNameUpdateLists;
      $scope.tmFund.payType = update.payTypeCode;
      $scope.tmFund.businessType = update.businessTypeCode;
      $scope.tmFund.listingTime = update.listingTime;
      $scope.tmFund.entryIntoForceTime = update.entryIntoForceTime;
      $scope.tmFund.note = update.note;
      if ($rootScope.counterparties && $rootScope.counterparties.length) {
        $rootScope.counterparties.forEach(function (i) {
          if (i.counterpartyId == $scope.tmFund.counterparty) {
            $scope.tmFund.tempCounterparty = i.counterpartyShortName;
          }
        })
      }
      switch (update.businessTypeCode) {
        case '1':
          $scope.tmFund.title = '现券下单修改';
          $scope.isEdit.isTicket = true;
          $scope.tmFund.bondName = JSON.parse(update.bondName);
          break;
        case '2':
          if (update.bondNameShow == '标准券') {
            $scope.chooseWorkday();
            $scope.tmFund.title = '交易所回购修改';
            $scope.isEdit.isExchange = true;
            $scope.tmFund.bondNumber = JSON.parse(update.bondName)[0].volume;
          } else {
            getBondAvailable(update.fundId);
            $scope.chooseWorkday();
            $scope.tmFund.title = '质押式回购修改';
            $scope.isEdit.isBuyBackZY = true;
          }
          break;
        case '3':
          getBondAvailable(update.fundId);
          $scope.chooseWorkday();
          $scope.tmFund.title = '买断式回购修改';
          $scope.isEdit.isBuyBackMD = true;
          break;
        case '4':
          $scope.tmFund.title = '一级交易修改';
          $scope.isEdit.isTrading = true;
          $scope.tmFund.bondName = JSON.parse(update.bondName);
          break;
        case '5':
          $scope.tmFund.title = '申购赎回修改';
          $scope.isEdit.isBuySell = true;
          $scope.tmFund.bondName = update.bondName;
          break;
        default:
          return;

      }
    }
    $scope.cancelEdit = function () {
      $('.tmTicket_addNew_wrap').css({
        transition: 'none'
      })
      $scope.isEdit = {
        isTicket: false,
        isBuyBackZY: false,
        isBuyBackMD: false,
        isTrading: false,
        isBuySell: false,
        isExchange: false
      };
      $scope.tmFund = {};
      $scope.tempList = {};
      $scope.bondAvailables = [];
      $scope.tempFundLists = [];
      $scope.isShowNumberType = false;
    };
    $scope.subEdit = function (flag) {
      if($scope.tmFund.changeBuyBackDate){
        var data = {
          businessId: $scope.tmFund.businessId,
          buyBackDay: $scope.tmFund.buyBackDay,
          buyBackClosingDate: $scope.tmFund.buyBackClosingDate
        }
        if(new Date(data.buyBackClosingDate.replace(/-/g, '/')).getTime()<new Date().setHours(0, 0, 0, 0)+24*60*60*1000){
          $rootScope.isError = true
          $rootScope.errText = '只能将日期更改为明天以后的工作日'
          return
        }
        showLoading()
        serverService.updateBuybackdate(data)
          .then(function () {
            $rootScope.isError = true
            $rootScope.errText = '到期时间更改成功'
            $scope.tmFund = {};
            $scope.tempList = {};
            $scope.isEdit = {
              isTicket: false,
              isBuyBackZY: false,
              isBuyBackMD: false,
              isTrading: false,
              isBuySell: false,
              isExchange: false
            };
            $scope.bondNameTempLists = [];
            $scope.bondAvailables = [];
            $scope.isShowNumberType = false;
            getOwnTransaction()
          })
        return
      }
      if ($rootScope.counterparties && $rootScope.counterparties.length) {
        $rootScope.counterparties.forEach(function (i) {
          if (i.counterpartyShortName == $scope.tmFund.tempCounterparty) {
            $scope.tmFund.counterpartyShortName = i.counterpartyShortName;
            $scope.tmFund.counterpartyId = i.counterpartyId
          }
        })
      }
      if (!$scope.tmFund.counterpartyShortName) {
        $scope.tmFund.counterpartyShortName = $scope.tmFund.tempCounterparty;
        $scope.tmFund.counterparty = 0;
      }
      if (!$scope.tmFund.transferAgentName) {
        $scope.tmFund.transferAgentId = 0;
      }
      $scope.isShowNumberTypeAmount = false;
      $scope.isShowNumberTypeTransPrice = true;
      if ($scope.tmFund.businessType === '2' || $scope.tmFund.businessType === '3') {
        $rootScope.fundNamesNormal.forEach(function (i) {
          if (i.fundId === $scope.tmFund.fundName) {
            $scope.tmFund.endDate = i.endDate
          }
        })
        if (new Date($scope.tmFund.buyBackClosingDate.replace(/-/g, '/')).getTime() > $scope.tmFund.endDate) {
          $rootScope.isError = true
          $rootScope.errText = '超过产品到期时间'
          return
        }
      }
      showLoading()
      if ($scope.tmFund.businessId) {
        switch ($scope.tmFund.businessType) {
          case '1':
            $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 1;
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.fullAmount = $scope.tmFund.fullAmount * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.tradeCounterpartyId = $scope.tmFund.tradeCounterpartyId || 0;
            $scope.tempList.transferAgentId = $scope.tmFund.transferAgentId || 0;
            $scope.tempList.protocolNumber = $scope.tmFund.protocolNumber || '';
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            $scope.tempList.bondHeadId = $scope.tmFund.bondHeadName || '';
            $scope.tempList.amount = $scope.tmFund.bondNumber * $scope.tmFund.fullAmount * 1 || '';
            $scope.tempList.market = $scope.tmFund.market || '';
            $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
            $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
            $scope.tempList.buyOrganization = $scope.tmFund.buyOrganization || '';
            $scope.tempList.sellOrganization = $scope.tmFund.sellOrganization || '';
            $scope.tempList.bondProportion = $scope.tmFund.bondProportion || '';
            $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
            $scope.tempList.payOrganization = $scope.tmFund.payOrganization || 'buy';
            $scope.tempList.fullPrice = $scope.tmFund.fullPrice || 'yes';
            $scope.tempList.denomination = $scope.tmFund.denomination * 10000 || '';
            $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
            $scope.tempList.bondNumber = $scope.tmFund.bondNumber || '';
            $scope.tempList.note = $scope.tmFund.note || '';
            if ($scope.tmFund.bondName) {
              $scope.tempList.bondName = JSON.stringify({
                securityId: $scope.tmFund.bondName.securityId,
                securityName: $scope.tmFund.bondName.securityName
              }) || null;
            }
            if ($scope.tempList.businessId) {
              serverService.updateTicket($scope.tempList).then(function () {
                $rootScope.errText = '修改成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.isShowNumberType = false;
                getOwnTransaction()
              });
            }
            break;
          case '2':
            if (flag == 'exchange') {
              $scope.tempList.traderId = $scope.tmFund.traderName || '';
              $scope.tempList.businessId = $scope.tmFund.businessId || '';
              $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 3;
              $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
              $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
              $scope.tempList.fundId = $scope.tmFund.fundName || '';
              $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
              $scope.tempList.capitalUserId = $scope.tmFund.capitalUserId || 0;
              $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
              $scope.tempList.counterpartyUserName = $scope.tmFund.counterpartyUserName || '';
              $scope.tempList.buyBackDay = $scope.tmFund.buyBackDay || '';
              $scope.tempList.startTime = $scope.tmFund.startTime || '';
              $scope.tempList.buyBackClosingDate = $scope.tmFund.buyBackClosingDate || '';
              $scope.tempList.market = $scope.tmFund.market || 1;
              $scope.tempList.interestRate = $scope.tmFund.interestRate || '';
              $scope.tempList.serviceType = $scope.tmFund.serviceType || '';
              $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
              $scope.tempList.note = $scope.tmFund.note || '';
              $scope.tempList.bondNumber = $scope.tmFund.bondNumber || 0;
              var tempId = ''
              if ($scope.tempList.market == 1) {
                tempId = 'StandardSecuritySH'
              } else {
                tempId = 'StandardSecuritySZ'
              }
              var tempBondName = [{
                securityName: '标准券',
                securityId: tempId,
                volume: $scope.tempList.bondNumber,
                proport: 100,
              }];
              $scope.tempList.bondName = JSON.stringify(tempBondName);
              if ($scope.tempList.businessId) {
                serverService.updateBuyBack($scope.tempList).then(function () {
                  $rootScope.errText = '修改成功';
                  $rootScope.isError = true;
                  $scope.tmFund = {};
                  $scope.tempList = {};
                  $scope.isEdit = {
                    isTicket: false,
                    isBuyBackZY: false,
                    isBuyBackMD: false,
                    isTrading: false,
                    isBuySell: false,
                    isExchange: false
                  };
                  $scope.bondNameTempLists = [];
                  $scope.bondAvailables = [];
                  $scope.tempFundLists = [];
                  $scope.isShowNumberType = false;
                  getOwnTransaction()
                });
              }
            } else {
              $scope.tempList.traderId = $scope.tmFund.traderName || '';
              $scope.tempList.businessId = $scope.tmFund.businessId || '';
              $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 3;
              $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
              $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
              $scope.tempList.fundId = $scope.tmFund.fundName || '';
              $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
              $scope.tempList.capitalUserId = $scope.tmFund.capitalUserId || 0;
              $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
              $scope.tempList.counterpartyUserName = $scope.tmFund.counterpartyUserName || '';
              $scope.tempList.buyBackDay = $scope.tmFund.buyBackDay || '';
              $scope.tempList.startTime = $scope.tmFund.startTime || '';
              $scope.tempList.buyBackClosingDate = $scope.tmFund.buyBackClosingDate || '';
              $scope.tempList.market = $scope.tmFund.market || '';
              $scope.tempList.interestRate = $scope.tmFund.interestRate || '';
              $scope.tempList.serviceType = $scope.tmFund.serviceType || '';
              $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
              $scope.tempList.note = $scope.tmFund.note || '';
              var tempBondName = [];
              for (var i = 0; i < $scope.tempFundLists.length; i++) {
                if ($scope.tempFundLists[i].securityId && $scope.tempFundLists[i].securityName && $scope.tempFundLists[i].available && $scope.tempFundLists[i].proport) {
                  tempBondName.push({
                    securityName: $scope.tempFundLists[i].securityName,
                    securityId: $scope.tempFundLists[i].securityId,
                    volume: +$scope.tempFundLists[i].available,
                    proport: +$scope.tempFundLists[i].proport,
                  });
                }
              }
              $scope.tempList.bondName = JSON.stringify(tempBondName);
              if ($scope.tempList.businessId) {
                serverService.updateBuyBack($scope.tempList).then(function () {
                  $rootScope.errText = '修改成功';
                  $rootScope.isError = true;
                  $scope.tmFund = {};
                  $scope.tempList = {};
                  $scope.isEdit = {
                    isTicket: false,
                    isBuyBackZY: false,
                    isBuyBackMD: false,
                    isTrading: false,
                    isBuySell: false,
                    isExchange: false
                  };
                  $scope.bondNameTempLists = [];
                  $scope.bondAvailables = [];
                  $scope.tempFundLists = [];
                  $scope.isShowNumberType = false;
                  getOwnTransaction()
                });
              }
            }
            break;
          case '3':
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 7;
            $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
            $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
            $scope.tempList.capitalUserId = $scope.tmFund.capitalUserId || 0;
            $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
            $scope.tempList.counterpartyUserName = $scope.tmFund.counterpartyUserName || '';
            $scope.tempList.buyBackDay = $scope.tmFund.buyBackDay || '';
            $scope.tempList.startTime = $scope.tmFund.startTime || '';
            $scope.tempList.buyBackClosingDate = $scope.tmFund.buyBackClosingDate || '';
            $scope.tempList.market = $scope.tmFund.market || '';
            $scope.tempList.interestRate = $scope.tmFund.interestRate || '';
            $scope.tempList.serviceType = $scope.tmFund.serviceType || '';
            $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
            $scope.tempList.note = $scope.tmFund.note || '';
            var tempBondName = [];
            for (var i = 0; i < $scope.tempFundLists.length; i++) {
              if ($scope.tempFundLists[i].securityId && $scope.tempFundLists[i].securityName && $scope.tempFundLists[i].available && $scope.tempFundLists[i].proport) {
                tempBondName.push({
                  securityName: $scope.tempFundLists[i].securityName,
                  securityId: $scope.tempFundLists[i].securityId,
                  volume: +$scope.tempFundLists[i].available,
                  proport: +$scope.tempFundLists[i].proport,
                });
              }
            }
            $scope.tempList.bondName = JSON.stringify(tempBondName);
            if ($scope.tempList.businessId) {
              serverService.updateBuyBack($scope.tempList).then(function () {
                $rootScope.errText = '修改成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.tempFundLists = [];
                $scope.isShowNumberType = false;
                getOwnTransaction()
              });
            }
            break;
          case '4':
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            $scope.tempList.market = $scope.tmFund.market || '';
            $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
            $scope.tempList.payType = $scope.tmFund.payType || '';
            $scope.tempList.fullPrice = $scope.tmFund.fullPrice || 'yes';
            $scope.tempList.denomination = $scope.tmFund.denomination * 10000 || '';
            $scope.tempList.listingTime = $scope.tmFund.listingTime || '';
            $scope.tempList.bondNumber = $scope.tmFund.bondNumber || '';
            $scope.tempList.note = $scope.tmFund.note || '';
            if ($scope.tmFund.bondName) {
              $scope.tempList.bondName = JSON.stringify({
                securityId: $scope.tmFund.bondName.securityId,
                securityName: $scope.tmFund.bondName.securityName
              }) || null;
            }
            if ($scope.tempList.businessId) {
              serverService.updateTradingOrders($scope.tempList).then(function () {
                $rootScope.errText = '修改成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.isShowNumberTypeAmount = false;
                $scope.isShowNumberTypeTransPrice = true;
                getOwnTransaction()
              });
            }
            break;
          case '5':
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 5;
            $scope.tempList.entryIntoForceTime = $scope.tmFund.entryIntoForceTime || '';
            $scope.tempList.note = $scope.tmFund.note || '';
            if ($scope.tempList.businessId) {
              serverService.updateFundBuySell($scope.tempList).then(function () {
                $rootScope.errText = '修改成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.isShowNumberTypeAmount = false;
                $scope.isShowNumberTypeTransPrice = true;
                getOwnTransaction()
              });
            }
            break;
          default:
            return;
        }
      } else {
        switch ($scope.tmFund.businessType) {
          case '1':
            $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 1;
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.fullAmount = $scope.tmFund.fullAmount * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            $scope.tempList.bondHeadId = $scope.tmFund.bondHeadName || '';
            $scope.tempList.tradeCounterpartyId = $scope.tmFund.tradeCounterpartyId || 0;
            $scope.tempList.transferAgentId = $scope.tmFund.transferAgentId || 0;
            $scope.tempList.protocolNumber = $scope.tmFund.protocolNumber || '';
            $scope.tempList.amount = $scope.tmFund.bondNumber * $scope.tmFund.fullAmount * 1 || '';
            if ($scope.tmFund.bondName) {
              $scope.tempList.bondName = JSON.stringify({
                securityId: $scope.tmFund.bondName.securityId,
                securityName: $scope.tmFund.bondName.securityName
              }) || null;
            }
            $scope.tempList.market = $scope.tmFund.market || '';
            $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
            $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
            $scope.tempList.buyOrganization = $scope.tmFund.buyOrganization || '';
            $scope.tempList.sellOrganization = $scope.tmFund.sellOrganization || '';
            $scope.tempList.bondProportion = $scope.tmFund.bondProportion || '';
            $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
            $scope.tempList.payOrganization = $scope.tmFund.payOrganization || 'buy';
            $scope.tempList.fullPrice = $scope.tmFund.fullPrice || 'yes';
            $scope.tempList.denomination = $scope.tmFund.denomination * 10000 || '';
            $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
            $scope.tempList.bondNumber = $scope.tmFund.bondNumber || '';
            $scope.tempList.note = $scope.tmFund.note || '';
            if ($scope.tempList.bondName) {
              serverService.ticketPlace($scope.tempList).then(function () {
                $rootScope.errText = '创建成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.isShowNumberTypeAmount = false;
                $scope.isShowNumberTypeTransPrice = true;
                getOwnTransaction()
              });
            } else {
              $rootScope.errText = '请输入债券名称';
              $rootScope.isError = true;
            }
            break;
          case '2':
            if ($scope.isEdit.isExchange) {
              $scope.tempList.traderId = $scope.tmFund.traderName || '';
              $scope.tempList.businessId = $scope.tmFund.businessId || '';
              $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 3;
              $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
              $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
              $scope.tempList.fundId = $scope.tmFund.fundName || '';
              $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
              $scope.tempList.capitalUserId = $scope.tmFund.capitalUserId || 0;
              $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
              $scope.tempList.counterpartyUserName = $scope.tmFund.counterpartyUserName || '';
              $scope.tempList.buyBackDay = $scope.tmFund.buyBackDay || '';
              $scope.tempList.startTime = $scope.tmFund.startTime || '';
              $scope.tempList.buyBackClosingDate = $scope.tmFund.buyBackClosingDate || '';
              $scope.tempList.market = $scope.tmFund.market || '';
              $scope.tempList.interestRate = $scope.tmFund.interestRate || '';
              $scope.tempList.serviceType = $scope.tmFund.serviceType || '';
              $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
              $scope.tempList.note = $scope.tmFund.note || '';
              $scope.tempList.bondNumber = $scope.tmFund.bondNumber || 0;
              var tempId = ''
              if ($scope.tempList.market == 1) {
                tempId = 'StandardSecuritySH'
              } else {
                tempId = 'StandardSecuritySZ'
              }
              var tempBondName = [{
                securityName: '标准券',
                securityId: tempId,
                volume: $scope.tempList.bondNumber,
                proport: 100,
              }];
              $scope.tempList.bondName = JSON.stringify(tempBondName);
              serverService.buyBackZY($scope.tempList).then(function () {
                $rootScope.errText = '创建成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.tempFundLists = [];
                $scope.isShowNumberTypeAmount = false;
                $scope.isShowNumberTypeTransPrice = true;
                getOwnTransaction()
              });
            } else {
              $scope.tempList.traderId = $scope.tmFund.traderName || '';
              $scope.tempList.businessId = $scope.tmFund.businessId || '';
              $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 3;
              $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
              $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
              $scope.tempList.fundId = $scope.tmFund.fundName || '';
              $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
              $scope.tempList.capitalUserId = $scope.tmFund.capitalUserId || 0;
              $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
              $scope.tempList.counterpartyUserName = $scope.tmFund.counterpartyUserName || '';
              $scope.tempList.buyBackDay = $scope.tmFund.buyBackDay || '';
              $scope.tempList.startTime = $scope.tmFund.startTime || '';
              $scope.tempList.buyBackClosingDate = $scope.tmFund.buyBackClosingDate || '';
              $scope.tempList.market = $scope.tmFund.market || '';
              $scope.tempList.interestRate = $scope.tmFund.interestRate || '';
              $scope.tempList.serviceType = $scope.tmFund.serviceType || '';
              $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
              $scope.tempList.note = $scope.tmFund.note || '';
              var tempBondName = [];
              for (var i = 0; i < $scope.tempFundLists.length; i++) {
                if ($scope.tempFundLists[i].securityId && $scope.tempFundLists[i].securityName && $scope.tempFundLists[i].available && $scope.tempFundLists[i].proport) {
                  tempBondName.push({
                    securityName: $scope.tempFundLists[i].securityName,
                    securityId: $scope.tempFundLists[i].securityId,
                    volume: +$scope.tempFundLists[i].available,
                    proport: +$scope.tempFundLists[i].proport,
                  });
                }
              }
              $scope.tempList.bondName = JSON.stringify(tempBondName);
              serverService.buyBackZY($scope.tempList).then(function () {
                $rootScope.errText = '创建成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.tempFundLists = [];
                $scope.isShowNumberTypeAmount = false;
                $scope.isShowNumberTypeTransPrice = true;
                getOwnTransaction()
              });
            }
            break;
          case '3':
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 7;
            $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
            $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.counterpartyId = $scope.tmFund.counterpartyId || 0;
            $scope.tempList.capitalUserId = $scope.tmFund.capitalUserId || 0;
            $scope.tempList.counterpartyShortName = $scope.tmFund.counterpartyShortName || '';
            $scope.tempList.counterpartyUserName = $scope.tmFund.counterpartyUserName || '';
            $scope.tempList.buyBackDay = $scope.tmFund.buyBackDay || '';
            $scope.tempList.startTime = $scope.tmFund.startTime || '';
            $scope.tempList.buyBackClosingDate = $scope.tmFund.buyBackClosingDate || '';
            $scope.tempList.market = $scope.tmFund.market || '';
            $scope.tempList.interestRate = $scope.tmFund.interestRate || '';
            $scope.tempList.serviceType = $scope.tmFund.serviceType || '';
            $scope.tempList.liquidationSpeed = $scope.tmFund.liquidationSpeed || 0;
            $scope.tempList.note = $scope.tmFund.note || '';
            var tempBondName = [];
            for (var i = 0; i < $scope.tempFundLists.length; i++) {
              if ($scope.tempFundLists[i].securityId && $scope.tempFundLists[i].securityName && $scope.tempFundLists[i].available && $scope.tempFundLists[i].proport) {
                tempBondName.push({
                  securityName: $scope.tempFundLists[i].securityName,
                  securityId: $scope.tempFundLists[i].securityId,
                  volume: +$scope.tempFundLists[i].available,
                  proport: +$scope.tempFundLists[i].proport,
                });
              }
            }
            $scope.tempList.bondName = JSON.stringify(tempBondName);
            serverService.buyBackMD($scope.tempList).then(function () {
              $rootScope.errText = '创建成功';
              $rootScope.isError = true;
              $scope.tmFund = {};
              $scope.tempList = {};
              $scope.isEdit = {
                isTicket: false,
                isBuyBackZY: false,
                isBuyBackMD: false,
                isTrading: false,
                isBuySell: false,
                isExchange: false
              };
              $scope.bondNameTempLists = [];
              $scope.bondAvailables = [];
              $scope.tempFundLists = [];
              $scope.isShowNumberTypeAmount = false;
              $scope.isShowNumberTypeTransPrice = true;
              getOwnTransaction()
            });
            break;
          case '4':
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            if ($scope.tmFund.bondName) {
              $scope.tempList.bondName = JSON.stringify({
                securityId: $scope.tmFund.bondName.securityId,
                securityName: $scope.tmFund.bondName.securityName
              }) || null;
            }
            $scope.tempList.market = $scope.tmFund.market || '';
            $scope.tempList.transPrice = $scope.tmFund.transPrice * 1 || '';
            $scope.tempList.payType = $scope.tmFund.payType || '';
            $scope.tempList.fullPrice = $scope.tmFund.fullPrice || 'yes';
            $scope.tempList.denomination = $scope.tmFund.denomination || '';
            $scope.tempList.listingTime = $scope.tmFund.listingTime || '';
            $scope.tempList.bondNumber = $scope.tmFund.bondNumber || '';
            $scope.tempList.note = $scope.tmFund.note || '';
            if ($scope.tempList.bondName) {
              serverService.tradingOrders($scope.tempList).then(function () {
                $rootScope.errText = '创建成功';
                $rootScope.isError = true;
                $scope.tmFund = {};
                $scope.tempList = {};
                $scope.isEdit = {
                  isTicket: false,
                  isBuyBackZY: false,
                  isBuyBackMD: false,
                  isTrading: false,
                  isBuySell: false,
                  isExchange: false
                };
                $scope.bondNameTempLists = [];
                $scope.bondAvailables = [];
                $scope.isShowNumberTypeAmount = false;
                $scope.isShowNumberTypeTransPrice = true;
                getOwnTransaction()
              });
            } else {
              $rootScope.errText = '请输入债券名称';
              $rootScope.isError = true;
            }
            break;
          case '5':
            $scope.tempList.businessId = $scope.tmFund.businessId || '';
            $scope.tempList.amount = $scope.tmFund.amount * 1 || '';
            $scope.tempList.fundId = $scope.tmFund.fundName || '';
            $scope.tempList.traderId = $scope.tmFund.traderName || '';
            $scope.tempList.businessDirection = $scope.tmFund.businessDirection || 5;
            $scope.tempList.entryIntoForceTime = $scope.tmFund.entryIntoForceTime || '';
            $scope.tempList.note = $scope.tmFund.note || '';
            serverService.fundBuySell($scope.tempList).then(function () {
              $rootScope.errText = '创建成功';
              $rootScope.isError = true;
              $scope.tmFund = {};
              $scope.tempList = {};
              $scope.isEdit = {
                isTicket: false,
                isBuyBackZY: false,
                isBuyBackMD: false,
                isTrading: false,
                isBuySell: false,
                isExchange: false
              };
              $scope.bondNameTempLists = [];
              $scope.bondAvailables = [];
              $scope.isShowNumberTypeAmount = false;
              $scope.isShowNumberTypeTransPrice = true;
              getOwnTransaction()
            });
            break;
          default:
            return;
        }
      }
    }
    $scope.chooseCounterparty = function (item) {
      $scope.tmFund.tempCounterparty = item.counterpartyShortName;
      $scope.tmFund.counterparty = item.counterpartyId;
      $scope.isFuzzySearchCounter = false;
      $scope.selectLinkMan();
    }
    //取消确认
    $scope.replyItem = function (item) {
      if(item.oldBusiness){
        return
      }
      showLoading()
      serverService.replyBusiness(item)
        .then(function () {
          $rootScope.isError = true
          $rootScope.errText = '取消成功'
          getOwnTransaction()
        })
    }
    $scope.cancelFuzzySearch = function (flag) {
      var timer4 = $timeout(function () {
        $scope[flag] = false;
      }, 200)
      $scope.$on('$destroy', function () {
        $timeout.cancel(timer4);
      });
    }
    //计算价格
    $scope.getFullAmount = function () {
      $scope.tmFund.denomination = $scope.tmFund.bondNumber / 100;
    }
    //showNumberType
    $scope.showNumberType = function (str, flag) {
      if (flag) {
        $scope[str] = true;
      } else {
        $scope[str] = false;
      }
    }
    //turnNumber
    $scope.turnNumber = function (name, value) {
      $scope.tmFund[name] = value.replace(/,/g, '');
    }
    //自动计算回购金额和结算金额
    $scope.getAmount = function () {
      var amount = 0;
      $scope.tempFundLists.forEach(function (i) {
        if (i.available && i.proport) {
          amount += i.available * i.proport;
        }
      })
      $scope.tmFund.amount = amount;
      $scope.getTransPrice();
    };
    $scope.getAmountExChange = function () {
      $scope.tmFund.amount = $scope.tmFund.bondNumber * 100;
      $scope.getTransPrice();
    }
    $scope.getTransPrice = function () {
      if ($scope.tmFund.interestRate) {
        $scope.tmFund.transPrice = $scope.tmFund.amount * (+$scope.tmFund.interestRate / 100) * $scope.tmFund.realDate / 365 + +$scope.tmFund.amount;
      }
    }
    //撤销与确认
    $scope.deleteBusiness = function (item) {
      var passCount = 0;
      var errCount = 0;
      var totalCount = 0;
      if (item.state != '待确认') {
        return;
      }
      var isFirst = true;
      if (isFirst) {
        isFirst = false;
        var subMore = false;
        for (var j = 0; j < $scope.items.length; j++) {
          if ($scope.items[j].isChecked == true) {
            subMore = true;
            totalCount++;
          }
        }
        if (subMore) {
          $scope.$emit('chooseResult', {
            str: '暂不支持批量撤销功能',
            cb: function () {
              return
            }
          })
        } else {
          $scope.$emit('chooseResult', {
            str: '确定撤销该订单吗？',
            cb: function () {
              serverService.cancelTransaction(item.businessId).then(function (data) {
                $rootScope.errText = '撤销成功';
                $rootScope.isError = true;
                getOwnTransaction()
                isFirst = true;
              }, function (err) {
                $scope.$emit('rejectError', err)
                isFirst = true;
              });
            }
          })
        }
      }

      function serverEnd() {
        if (passCount + errCount == totalCount) {
          $rootScope.isError = true;
          $rootScope.errText = '操作完毕，成功' + passCount + '，失败' + errCount;
          getOwnTransaction()
          isFirst = true;
        }
      }
    };
    $scope.passBusiness = function (item) {
      var passCount = 0;
      var errCount = 0;
      var totalCount = 0;
      if (item.state != '待确认') {
        return;
      }
      var isFirst = true;
      if (isFirst) {
        isFirst = false;
        var subMore = false;
        for (var j = 0; j < $scope.items.length; j++) {
          if ($scope.items[j].isChecked == true) {
            subMore = true;
            totalCount++;
          }
        }
        if (subMore) {
          $scope.$emit('chooseResult', {
            str: '确认选中订单么？',
            cb: function () {
              var tempList = ''
              $scope.items.forEach(function (i) {
                if (i.isChecked == true && i.state == '待确认') {
                  tempList += i.businessId + ';';
                }
              })
              if (tempList == '') {
                return
              }
              serverService.transactionCompleteAll(tempList).then(function () {
                serverEnd();
              }, function (err) {
                serverEnd();
              });
            }
          })
        } else {
          $scope.$emit('chooseResult', {
            str: '确认该订单？',
            cb: function () {
              serverService.transactionComplete(item.businessId).then(function () {
                $rootScope.errText = '订单提交成功';
                $rootScope.isError = true;
                getOwnTransaction()
                isFirst = true;
              }, function (err) {
                $scope.$emit('rejectError', err)
                isFirst = true;
              });
            }
          })
        }

        function serverEnd() {
          $rootScope.isError = true;
          $rootScope.errText = '操作完成'
          getOwnTransaction()
          isFirst = true;
        }
      }
    };
    document.addEventListener('click', pushShowAddNew);

    function pushShowAddNew(ev) {
      if (ev.target.localName.toUpperCase() != 'IMG' && ev.target.localName.toUpperCase() != 'A' && $rootScope.pageNow == 'tmOwn') {
        $scope.isShowAddNew = false;
      } else if ($rootScope.pageNow != 'tmOwn') {
        document.removeEventListener('click', pushShowAddNew)
      }
    }

    //键盘快捷键
    document.addEventListener('keydown', startEdit)

    function startEdit(ev) {
      if ($rootScope.pageNow != 'tmOwn') {
        document.removeEventListener('keydown', startEdit)
      } else if (ev.altKey) {
        switch (ev.keyCode) {
          case 49:
            $scope.ownAddNew(1)
            break
          case 50:
            $scope.ownAddNew(2)
            break
          case 51:
            $scope.ownAddNew(3)
            break
          case 52:
            $scope.ownAddNew(4)
            break
          case 53:
            $scope.ownAddNew(5)
            break
          case 54:
            $scope.ownAddNew(6)
            break
          default:
            break
        }
      }
    }

    //跳转到指令详情
    $scope.goOrder = function (item) {
      storage.session.setItem(storage.KEY.NOTI, item.orderId)
      $location.path('/rmSubOrders').replace();
      $scope.$broadcast('showModal')
    }
    /*
    jQuery(function () {
        jQuery('input:text:first').focus();
        var $inp = jQuery('input:text');
        $inp.bind('keydown', function (e) {
            var key = e.which;
            if (key == 13) {
                e.preventDefault();
                var nxtIdx = $inp.index(this) + 1;
                jQuery(":input:text:eq(" + nxtIdx + ")").focus();
            }
        });
    });*/
    //分页插件通信
    $scope.$on('tmOwn', function (ev, data) {
      getOwnTransaction()
    });
  }]);
});